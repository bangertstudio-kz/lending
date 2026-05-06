import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { name, contact, description } = await request.json();

  if (!name || !contact) {
    return Response.json({ error: 'Missing fields' }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return Response.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const descriptionLine = description ? `\n\n📋 *Описание проекта:*\n${description}` : '';
  const text = `📩 *Новая заявка с сайта*\n\n👤 *Имя:* ${name}\n\n📞 *Как связаться:* ${contact}${descriptionLine}`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });

  if (!res.ok) {
    return Response.json({ error: 'Telegram error' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
