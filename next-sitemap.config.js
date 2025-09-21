/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://deanmachines.com',
  generateRobotsTxt: true, // We'll handle robots.txt separately if needed
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  sitemapPath: 'sitemap.xml',
  robotsPath: 'robots.txt',
  exclude: ['/api/*', '/demo-rag/*'], // Exclude dynamic/internal paths
  additionalPaths: async (config) => [
    await config.transform(config, '/docs', 'daily', 0.8),
    await config.transform(config, '/login', 'monthly', 0.5),
  ],
  transform: async (config, path) => ({
    loc: path,
    changefreq: 'daily',
    priority: 0.7,
    lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
  }),
};
