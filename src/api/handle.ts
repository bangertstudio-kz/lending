import type { NextApiHandler, NextApiRequest } from 'next';
import { Readable } from 'node:stream';

type Method = 'GET' | 'POST';
type Handler = (request: Request) => Promise<Response>;

/**
 * Запускает web-style обработчик (Request → Response) внутри Pages API route.
 * App Router в проекте выключен (папка app/ сама включала его и перехватывала 404),
 * а обработчики оставлены на Fetch API: так multipart с файлами читается через
 * request.formData() без сторонних парсеров. В pages-файле обязательно
 * `export const config = { api: { bodyParser: false } }`, иначе тело уже съедено.
 */
export function handle(handlers: Partial<Record<Method, Handler>>): NextApiHandler {
  return async (req, res) => {
    const fn = handlers[req.method as Method];
    if (!fn) {
      res.setHeader('Allow', Object.keys(handlers).join(', '));
      res.status(405).end();
      return;
    }
    const response = await fn(toRequest(req));
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.send(Buffer.from(await response.arrayBuffer()));
  };
}

function toRequest(req: NextApiRequest): Request {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(key, value);
  }
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  return new Request(`http://${req.headers.host ?? 'localhost'}${req.url}`, {
    method: req.method,
    headers,
    body: hasBody ? (Readable.toWeb(req) as ReadableStream) : undefined,
    // duplex обязателен для стримового body в undici, в DOM-типах его нет.
    ...({ duplex: 'half' } as object),
  });
}
