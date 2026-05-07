import { NextRequest } from 'next/server';
import { sendTelegramMessage } from '../send_telegram_message';

export async function POST(request: NextRequest) {
  const { name, contact, description } = await request.json();

  if (!name || !contact) {
    return Response.json({ error: 'Missing fields' }, { status: 400 });
  }
  const descriptionLine = description ? `\n\n📋 *Описание проекта:*\n${description}` : '';
  const text = `📩 *Новая заявка с сайта*\n\n👤 *Имя:* ${name}\n\n📞 *Как связаться:* ${contact}\n\n${descriptionLine}`;

  const res = await sendTelegramMessage(text);

  if (!res?.ok) {
    return Response.json({ error: 'Telegram error' }, { status: 502 });
  }

  return Response.json({ ok: true });
}

