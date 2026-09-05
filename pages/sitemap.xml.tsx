import { statSync } from 'node:fs';
import path from 'node:path';
import { GetServerSideProps } from 'next';

const SITE_URL = 'https://bangertstudio.kz';

// lastmod берём из времени изменения файлов, которые реально формируют страницу.
// Проставлять сюда текущую дату — значит врать краулеру на каждом запросе.
const pages = [
  { path: '/',           changefreq: 'weekly',  priority: '1.0', sources: ['app/locales/ru.json', 'app/data/cases.json'] },
  { path: '/cases',      changefreq: 'weekly',  priority: '0.8', sources: ['app/data/cases.json'] },
  { path: '/packages',   changefreq: 'weekly',  priority: '0.8', sources: ['app/locales/ru.json'] },
  { path: '/calculator', changefreq: 'monthly', priority: '0.7', sources: ['app/data/calculator.json'] },
];

function lastModified(sources: string[]): string | null {
  const times = sources
    .map((file) => {
      try {
        return statSync(path.join(process.cwd(), file)).mtime.getTime();
      } catch {
        return null;
      }
    })
    .filter((time): time is number => time !== null);

  return times.length ? new Date(Math.max(...times)).toISOString().slice(0, 10) : null;
}

function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(({ path: urlPath, changefreq, priority, sources }) => {
    const lastmod = lastModified(sources);
    return `  <url>
    <loc>${SITE_URL}${urlPath}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default Sitemap;
