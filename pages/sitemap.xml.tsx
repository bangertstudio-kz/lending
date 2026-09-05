import { GetServerSideProps } from 'next';

const SITE_URL = 'https://bangertstudio.kz';

const pages = [
  { path: '/',           changefreq: 'weekly',  priority: '1.0' },
  { path: '/cases',      changefreq: 'weekly',  priority: '0.8' },
  { path: '/packages',   changefreq: 'weekly',  priority: '0.8' },
  { path: '/calculator', changefreq: 'monthly', priority: '0.7' },
];

function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default Sitemap;
