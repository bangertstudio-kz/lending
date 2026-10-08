import { execSync } from 'node:child_process';
import type { NextConfig } from 'next';

// Файлы, из которых sitemap берёт lastmod. mtime на Vercel бесполезен — там
// у всех файлов сборки стоит 2018-10-20, — поэтому берём дату последнего
// коммита. git есть только на этапе сборки, так что считаем здесь.
// ponytail: Vercel клонирует репозиторий неглубоко; если файл давно не менялся,
// git вернёт пустоту и lastmod просто не попадёт в sitemap.
const SITEMAP_SOURCES = ['app/locales/ru.json', 'app/data/cases.json', 'app/data/calculator.json'];

function gitDate(file: string): string {
  try {
    return execSync(`git log -1 --format=%cs -- ${file}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

const nextConfig: NextConfig = {
  env: {
    SITEMAP_LASTMOD: JSON.stringify(Object.fromEntries(SITEMAP_SOURCES.map((f) => [f, gitDate(f)]))),
  },
  i18n: {
    locales: ['ru', 'en', 'kk', 'pt', 'es'],
    defaultLocale: 'ru',
    // Автоопределение выключено намеренно: иначе Next редиректит корень по
    // заголовку Accept-Language, и посетитель попадает не туда, куда вёл
    // переход, а краулер видит нестабильный ответ на "/".
    localeDetection: false,
  },
};

export default nextConfig;
