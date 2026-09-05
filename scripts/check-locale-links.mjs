// Язык живёт только в адресе страницы, поэтому любая внутренняя ссылка обязана
// нести префикс текущей локали. Стоит одной из них потерять префикс — переход
// по меню молча возвращает посетителя на русскую версию.
//
// eslint-плагин Next ловит только литералы (<a href="/cases">), а меню строит
// адреса из переменной, поэтому проверяем отрендеренный HTML.
//
// Требует запущенный сервер: `npm run dev` или `npm run build && npm start`.
// Адрес можно переопределить: BASE=http://localhost:3001 npm run check:links

const BASE = process.env.BASE ?? 'http://localhost:3000';
const DEFAULT_LOCALE = 'ru';
const LOCALES = ['ru', 'en', 'kk', 'pt', 'es'];
const PATHS = ['/', '/cases', '/packages', '/calculator'];

// Внутренние маршруты сайта — то, что обязано быть с префиксом.
const ROUTES = ['cases', 'packages', 'calculator'];
const INTERNAL = new RegExp(`^(?:/[a-z]{2})?(?:/(?:${ROUTES.join('|')}))?/?(?:#[\\w-]+)?$`);

const prefix = (locale) => (locale === DEFAULT_LOCALE ? '' : `/${locale}`);
const problems = [];
let checked = 0;

for (const locale of LOCALES) {
  for (const path of PATHS) {
    const url = `${BASE}${prefix(locale)}${path}`;
    let html;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        problems.push(`${url}: HTTP ${response.status}`);
        continue;
      }
      html = await response.text();
    } catch (error) {
      console.error(`Не удалось получить ${url}: ${error.message}`);
      console.error(`Сервер не отвечает на ${BASE}. Запустите npm run dev.`);
      process.exit(2);
    }

    const lang = html.match(/<html[^>]*\slang="([^"]*)"/)?.[1];
    if (lang !== locale) problems.push(`${url}: <html lang="${lang}">, ожидался "${locale}"`);

    const hrefs = [...new Set([...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]))];
    const internal = hrefs.filter((href) => INTERNAL.test(href));
    const bad = internal.filter((href) => !href.startsWith(`${prefix(locale)}/`) &&
      href !== prefix(locale) && !href.startsWith(`${prefix(locale)}#`));

    if (locale === DEFAULT_LOCALE) {
      // У русского префикса нет: ссылка не должна утаскивать на чужой язык.
      const foreign = internal.filter((href) =>
        LOCALES.some((other) => other !== DEFAULT_LOCALE && href.startsWith(`/${other}`)),
      );
      if (foreign.length) problems.push(`${url}: ссылки на чужую локаль: ${foreign.join(', ')}`);
    } else if (bad.length) {
      problems.push(`${url}: ссылки без префикса ${prefix(locale)}: ${bad.join(', ')}`);
    }

    if (!internal.length) problems.push(`${url}: внутренних ссылок не найдено — проверка вхолостую`);
    checked++;
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(`Ссылки держат локаль: ${checked} страниц (${LOCALES.join(', ')}).`);
