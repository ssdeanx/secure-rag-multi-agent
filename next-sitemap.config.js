/** @type {import('next-sitemap').IConfig} */
export const siteUrl = process.env.SITE_URL ?? 'https://deanmachines.com';
export const generateRobotsTxt = true;
export const sitemapSize = 7000;
export const changefreq = 'daily';
export const priority = 0.7;
export const sitemapPath = 'sitemap.xml';
export const robotsPath = 'robots.txt';
export const exclude = ['/api/*', '/demo-rag/*'];
export async function additionalPaths(config) {
  return [
    {
      loc: '/docs',
      changefreq: 'daily',
      priority: 0.8,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    },
    {
      loc: '/login',
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    },
  ];
}
export async function transform(config, path) {
  return ({
    loc: path,
    changefreq: 'daily',
    priority: 0.7,
    lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
  });
}
