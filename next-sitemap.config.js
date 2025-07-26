/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.microgenie.app/',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    changefreq: 'weekly',
    priority: 0.7,
    exclude: ['/admin', '/dashboard', '/api/*'],
  }