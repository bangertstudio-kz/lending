import { GetServerSideProps } from 'next';
import { DEFAULT_LOCALE, LOCALES, urlFor } from '@/src/seo';
import { ALL_SERVICES } from '@/src/data/services';
import { getCases, getPosts } from '@/src/data/content';

// lastmod берём из даты последнего коммита файлов, которые реально формируют страницу.
// Проставлять сюда текущую дату — значит врать краулеру на каждом запросе.
// Кейсы и статьи — из Supabase: у статьи lastmod — её дата, у кейсов даты нет, и мы её не выдумываем.
const staticPages = [
  { path: '/',           changefreq: 'weekly',  priority: '1.0', sources: ['src/locales/ru.json'] },
  { path: '/cases',      changefreq: 'weekly',  priority: '0.8', sources: [] },
  { path: '/packages',   changefreq: 'weekly',  priority: '0.8', sources: ['src/locales/ru.json'] },
  { path: '/calculator', changefreq: 'monthly', priority: '0.7', sources: ['src/data/calculator.json'] },
  { path: '/blog',       changefreq: 'weekly',  priority: '0.7', sources: [] },
  ...ALL_SERVICES.map((s) => ({ path: `/services/${s.slug}`, changefreq: 'monthly', priority: '0.8', sources: ['src/locales/ru.json'] })),
];

// Даты коммитов посчитаны при сборке в next.config.ts.
const commitDates: Record<string, string> = JSON.parse(process.env.SITEMAP_LASTMOD || '{}');

function lastModified(sources: string[]): string | null {
  const dates = sources.map((file) => commitDates[file]).filter(Boolean).sort();
  return dates.at(-1) ?? null;
}

function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const [cases, posts] = await Promise.all([getCases(), getPosts()]);
  const pages = [
    ...staticPages.map((p) => ({ ...p, lastmod: lastModified(p.sources) })),
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, changefreq: 'monthly', priority: '0.6', lastmod: p.date })),
    ...cases.map((c) => ({ path: `/cases/${c.id}`, changefreq: 'monthly', priority: '0.6', lastmod: null })),
  ];
  const entries = pages.flatMap(({ path: urlPath, changefreq, priority, lastmod }) => {

    // Каждая языковая версия — отдельный адрес, и каждая перечисляет все
    // остальные через xhtml:link. Без этого версии конкурируют друг с другом.
    return LOCALES.map((locale) => {
      const alternates = LOCALES.map(
        (alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${urlFor(alt, urlPath)}"/>`,
      ).join('\n');

      return `  <url>
    <loc>${urlFor(locale, urlPath)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(DEFAULT_LOCALE, urlPath)}"/>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default Sitemap;
