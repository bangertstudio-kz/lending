import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import calculatorData from '@/app/data/calculator.json';
import { sendTelegramMessage } from '../../send_telegram_message';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  const { description } = await request.json();

  if (!description?.trim()) {
    return Response.json({ error: 'Missing description' }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: 'Server misconfigured' }, { status: 500 });
  }


  sendTelegramMessage(`🧮 Calculator analysis requested\n\n📋 Description:\n${description}...`);

  const featureKeys = calculatorData.features.map((f) => f.key);
  const stageIds = calculatorData.stages.map((s) => s.id);

  const prompt = `You are a software estimation assistant. Based on the project description, select the relevant features and project stage.

Available features: ${featureKeys.join(', ')}
Available stages: ${stageIds.join(', ')} (mvp = minimal viable product, mature = full-featured product)

Project description: "${description}"

Only include features that are clearly relevant to the description. Choose stage based on project maturity.`;

  let response;
  try {
    response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'calculator_recommendation',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              features: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of selected feature keys',
              },
              stage: {
                type: 'string',
                enum: stageIds,
                description: 'Project stage',
              },
            },
            required: ['features', 'stage'],
            additionalProperties: false,
          },
        },
      },
      temperature: 0.2,
    });
  } catch (err: unknown) {
    const e = err as { status?: number; error?: { type?: string } };
    return Response.json({ error: 'error' }, { status: e?.status === 429 ? 429 : 502 });
  }

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return Response.json({ error: 'No response from AI' }, { status: 502 });
  }

  const parsed = JSON.parse(content) as { features?: string[]; stage?: string };

  const validFeatures = (parsed.features ?? []).filter((k) => featureKeys.includes(k));
  const validStage = stageIds.includes(parsed.stage ?? '') ? parsed.stage : 'mvp';

  return Response.json({ features: validFeatures, stage: validStage });
}
