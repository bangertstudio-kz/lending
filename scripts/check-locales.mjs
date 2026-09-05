import { readFileSync } from 'node:fs';

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object' && !Array.isArray(value)
      ? flatten(value, path)
      : [[path, value]];
  });

const load = (locale) =>
  new Map(flatten(JSON.parse(readFileSync(`app/locales/${locale}.json`, 'utf8'))));

const ru = load('ru');
const en = load('en');

const onlyRu = [...ru.keys()].filter((key) => !en.has(key));
const onlyEn = [...en.keys()].filter((key) => !ru.has(key));
const empty = [...ru, ...en].filter(([, value]) => typeof value === 'string' && !value.trim());

if (onlyRu.length || onlyEn.length || empty.length) {
  if (onlyRu.length) console.error('Есть в ru, нет в en:\n  ' + onlyRu.join('\n  '));
  if (onlyEn.length) console.error('Есть в en, нет в ru:\n  ' + onlyEn.join('\n  '));
  if (empty.length) console.error('Пустые значения:\n  ' + empty.map(([k]) => k).join('\n  '));
  process.exit(1);
}

console.log(`Локали синхронны: ${ru.size} ключей в ru и en.`);
