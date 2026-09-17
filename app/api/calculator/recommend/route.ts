import { NextRequest, after } from 'next/server';
import OpenAI from 'openai';
import calculatorData from '@/app/data/calculator.json';
import { computeEstimates } from '@/app/data/estimates';
import { sendTelegramMessage } from '../../send_telegram_message';

type ContentPart =
  | { type: 'input_text'; text: string }
  | { type: 'input_file'; file_id: string }
  | { type: 'input_image'; image_url: string; detail: 'auto' | 'low' | 'high' | 'original' };

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const description = form.get('description') as string | null;
  const locale = form.get('locale') as string | null;
  const uploadedFiles = form.getAll('files') as File[];

  const lang = typeof locale === 'string' && locale ? locale : 'en';

  if (!description?.trim()) {
    return Response.json({ error: 'Missing description' }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  sendTelegramMessage(`🧮 Calculator analysis requested\n\n📋 Description:\n${description}...`, uploadedFiles, null);

  const featureKeys = calculatorData.features.map((f) => f.key);
  const stageIds = calculatorData.stages.map((s) => s.id);

  const prompt = `You are a software estimation assistant. Based on the project description, select the relevant features and project stage.

Available features: ${featureKeys.join(', ')}
Available stages: ${stageIds.join(', ')} (mvp = minimal viable product, mature = full-featured product)

Project description: "${description}"

Include only those functions that closely match the meaning of the technical specifications, or that the customer might need but is simply not aware of.
If the project requires functionality not covered by the available features, add it to customFeatures with a descriptive name, estimated cost in USD, and estimated development hours.
Use locale "${lang}" for customFeature names. Keep all feature names concise — 1 to 3 words maximum.`;

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const contentParts: ContentPart[] = [{ type: 'input_text', text: prompt }];

  for (const file of uploadedFiles) {
    if (file.type.startsWith('image/')) {
      const buffer = Buffer.from(await file.arrayBuffer());
      contentParts.push({
        type: 'input_image',
        image_url: `data:${file.type};base64,${buffer.toString('base64')}`,
        detail: 'auto',
      });
    } else {
      const uploaded = await client.files.create({ file, purpose: 'user_data' });
      contentParts.push({ type: 'input_file', file_id: uploaded.id });
    }
  }

  let response;

  try {
    response = await client.responses.create({
      model: 'gpt-4.1',
      input: [{ role: 'user', content: contentParts }],
      temperature: 0.2,
      text: {
        format: {
          type: 'json_schema',
          name: 'calculator_recommendation',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              features: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of selected feature keys from the available list',
              },
              customFeatures: {
                type: 'array',
                description: 'Features not in the available list that the project requires',
                items: {
                  type: 'object',
                  properties: {
                    key: { type: 'string', description: 'Short descriptive feature name in English' },
                    cost: { type: 'number', description: 'Estimated cost in USD' },
                    hours: { type: 'number', description: 'Estimated development hours' },
                  },
                  required: ['key', 'cost', 'hours'],
                  additionalProperties: false,
                },
              },
              stage: {
                type: 'string',
                enum: stageIds,
                description: 'Project stage',
              },
            },
            required: ['features', 'customFeatures', 'stage'],
            additionalProperties: false,
          },
        },
      },
    });
  } catch (err: unknown) {
    const e = err as { status?: number };
    return Response.json({ error: 'error' }, { status: e?.status === 429 ? 429 : 502 });
  }

  const content = response.output_text;
  if (!content) {
    return Response.json({ error: 'No response from AI' }, { status: 502 });
  }

  const parsed = JSON.parse(content) as {
    features?: string[];
    customFeatures?: { key: string; cost: number; hours: number }[];
    stage?: string;
  };

  const validFeatures = (parsed.features ?? []).filter((k) => featureKeys.includes(k));
  const validStage = stageIds.includes(parsed.stage ?? '') ? parsed.stage : 'mvp';
  const customFeatures = (parsed.customFeatures ?? []).filter(
    (f) => f.key && typeof f.cost === 'number' && typeof f.hours === 'number'
  );

  after(() => sendTelegramMessage(formatResultMessage(validFeatures, customFeatures, validStage ?? 'mvp'), undefined, null));

  return Response.json({ features: validFeatures, customFeatures, stage: validStage });
}

function formatResultMessage(
  features: string[],
  customFeatures: { key: string; cost: number; hours: number }[],
  stage: string
) {
  const allFeatures = [...features, ...customFeatures.map((f) => f.key)];
  const { minCost, maxCost, minWeeks, maxWeeks } = computeEstimates(
    allFeatures,
    stage,
    Object.fromEntries(customFeatures.map(({ key, cost, hours }) => [key, { cost, hours }]))
  );

  const lines = [
    '🤖 Calculator analysis result',
    '',
    `🏁 Stage: ${stage}`,
    `💰 Cost: $${minCost.toLocaleString('en-US')} – $${maxCost.toLocaleString('en-US')}`,
    `⏱ Timeline: ${minWeeks}–${maxWeeks} weeks`,
    '',
    `✅ Features (${features.length}):`,
    ...(features.length ? features.map((f) => `• ${f}`) : ['—']),
  ];

  if (customFeatures.length) {
    lines.push('', `✨ Custom features (${customFeatures.length}):`);
    lines.push(...customFeatures.map((f) => `• ${f.key} — $${f.cost}, ${f.hours}h`));
  }

  return lines.join('\n');
}
