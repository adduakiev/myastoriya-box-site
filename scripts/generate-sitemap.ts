import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import boxes from '../data/boxes.json'

const siteUrl = 'https://box.myastoriya.com.ua'
const occasionSlugs = ['office', 'home', 'picnic', 'birthday', 'corporate', 'march-8']

const urls = [
  '/',
  '/catalog',
  ...occasionSlugs.map((slug) => `/occasion/${slug}`),
  ...boxes.map((box) => `/boxes/${box.slug}`),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`)
    .join('\n') +
  `\n</urlset>\n`

const outPath = resolve('public/sitemap.xml')
writeFileSync(outPath, xml)

console.log(`Generated sitemap at ${outPath}`)
