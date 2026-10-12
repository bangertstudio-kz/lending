export async function sendTelegramMessage(
  message: string,
  files?: File[],
  parseMode: 'Markdown' | null = 'Markdown'
): Promise<Response> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 });
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, ...(parseMode && { parse_mode: parseMode }) }),
  });

  if (files?.length) {
    for (const file of files) {
      const form = new FormData();
      form.append('chat_id', chatId);
      form.append('document', file, file.name);
      await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
        method: 'POST',
        body: form,

      });
    }
  }

  return res;
}
