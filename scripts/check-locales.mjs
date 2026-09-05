import { readFileSync } from 'node:fs';

// Русский — эталон: с него переводили остальные.
const REFERENCE = 'ru';
const LOCALES = ['ru', 'en', 'kk', 'pt', 'es'];

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object' && !Array.isArray(value)
      ? flatten(value, path)
      : [[path, value]];
  });

const load = (locale) =>
  new Map(flatten(JSON.parse(readFileSync(`app/locales/${locale}.json`, 'utf8'))));

const reference = load(REFERENCE);
const problems = [];

for (const locale of LOCALES) {
  if (locale === REFERENCE) continue;

  const current = load(locale);
  const missing = [...reference.keys()].filter((key) => !current.has(key));
  const extra = [...current.keys()].filter((key) => !reference.has(key));
  const empty = [...current].filter(([, v]) => typeof v === 'string' && !v.trim()).map(([k]) => k);
  // Непереведённый ключ обычно выглядит как дословная копия русского.
  const untouched = [...current].filter(
    ([key, value]) => typeof value === 'string' && value === reference.get(key) && value.length > 24,
  ).map(([k]) => k);

  if (missing.length) problems.push(`${locale}: нет ${missing.length} ключей\n  ${missing.slice(0, 10).join('\n  ')}`);
  if (extra.length) problems.push(`${locale}: лишние ключи\n  ${extra.slice(0, 10).join('\n  ')}`);
  if (empty.length) problems.push(`${locale}: пустые значения\n  ${empty.slice(0, 10).join('\n  ')}`);
  if (untouched.length) problems.push(`${locale}: совпадает с русским (похоже, не переведено)\n  ${untouched.slice(0, 10).join('\n  ')}`);
}

if (problems.length) {
  console.error(problems.join('\n\n'));
  process.exit(1);
}

console.log(`Локали синхронны: ${reference.size} ключей × ${LOCALES.length} языков (${LOCALES.join(', ')}).`);
