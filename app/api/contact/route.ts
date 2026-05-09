import { NextRequest } from 'next/server';
import { sendTelegramMessage } from '../send_telegram_message';

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';

  let name: string | null = null;
  let contact: string | null = null;
  let description: string | null = null;
  let files: File[] = [];

  if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
    const form = await request.formData();
    name = form.get('name') as string | null;
    contact = form.get('contact') as string | null;
    description = form.get('description') as string | null;
    files = form.getAll('files') as File[];
  } else {
    const body = await request.json();
    name = body.name;
    contact = body.contact;
    description = body.description;
  }

  if (!name || !contact) {
    return Response.json({ error: 'Missing fields' }, { status: 400 });
  }

  const descriptionLine = description ? `\n\n📋 *Описание проекта:*\n${description}` : '';
  const text = `📩 *Новая заявка с сайта*\n\n👤 *Имя:* ${name}\n\n📞 *Как связаться:* ${contact}\n\n${descriptionLine}`;

  const res = await sendTelegramMessage(text, files.length ? files : undefined);

  if (!res?.ok) {
    return Response.json({ error: 'Telegram error' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
