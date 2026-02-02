import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as cheerio from 'cheerio'

const CATEGORY_URLS = [
  'https://myastoriya.com.ua/ua/gotovaya-produktsiya/nabory-dlya-kompaniy/',
  'https://myastoriya.com.ua/ua/gotovaya-produktsiya/nabory-dlya-kompaniy/page-2/',
]

const RATE_LIMIT_MS = 800
const RETRIES = 3

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchWithRetry = async (url: string) => {
  let lastError: unknown
  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MyastoriyaBoxBot/1.0)',
        },
      })
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }
      return await response.text()
    } catch (error) {
      lastError = error
      await sleep(RATE_LIMIT_MS * attempt)
    }
  }
  throw lastError
}

const parseNumber = (text: string) => Number(text.replace(/[^\d]/g, ''))

const parseWeight = (text: string) => {
  const kgMatch = text.match(/(\d+[\.,]?\d*)\s?кг/i)
  if (kgMatch) {
    return Math.round(parseFloat(kgMatch[1].replace(',', '.')) * 1000)
  }
  const gMatch = text.match(/(\d+[\.,]?\d*)\s?г/i)
  if (gMatch) {
    return Math.round(parseFloat(gMatch[1].replace(',', '.')))
  }
  return 0
}

const parsePersons = (text: string) => {
  const match = text.match(/(\d+)\s?(?:осіб|персон|persons)/i)
  if (match) {
    const value = Number(match[1])
    return { min: value, max: value }
  }
  const rangeMatch = text.match(/(\d+)\s?-\s?(\d+)\s?(?:осіб|персон|persons)/i)
  if (rangeMatch) {
    return { min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) }
  }
  return { min: 0, max: 0 }
}

const extractProductLinks = (html: string) => {
  const $ = cheerio.load(html)
  const links = new Set<string>()

  $('a').each((_, element) => {
    const href = $(element).attr('href')
    if (!href) return
    if (href.includes('/product/')) {
      links.add(href.split('?')[0])
    }
  })

  return Array.from(links)
}

const parseProductPage = async (url: string) => {
  const html = await fetchWithRetry(url)
  const $ = cheerio.load(html)

  const title = $('h1.product_title').first().text().trim()
  const priceText = $('.price .woocommerce-Price-amount').first().text()
  const price_uah = parseNumber(priceText)

  const summaryText = $('.summary').text()
  const weight_g = parseWeight(summaryText)
  const personsData = parsePersons(summaryText)

  const descriptionHtml = $('.woocommerce-product-details__short-description').html() ||
    $('.woocommerce-Tabs-panel--description').html() ||
    ''

  let composition = ''
  $('h2, h3, strong').each((_, element) => {
    const heading = $(element).text().trim().toLowerCase()
    if (heading.includes('склад') || heading.includes('composition')) {
      const nextText = $(element).next().text().trim()
      if (nextText) {
        composition = nextText
      }
    }
  })

  if (!composition) {
    composition = $('.product_meta').text().replace(/\s+/g, ' ').trim()
  }

  const images = Array.from(
    new Set(
      $('.woocommerce-product-gallery__image img')
        .map((_, element) => $(element).attr('data-src') || $(element).attr('src'))
        .get()
        .filter(Boolean)
    )
  ) as string[]

  const canonical = $('link[rel="canonical"]').attr('href') || url

  return {
    id: `box-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
    slug: canonical.split('/').filter(Boolean).pop() || '',
    title,
    price_uah,
    weight_g,
    persons_min: personsData.min,
    persons_max: personsData.max,
    format_tags: [],
    occasion_tags: [],
    description_html: descriptionHtml,
    composition_text: composition,
    images,
    canonical_url: canonical,
    buy_url: `${canonical}?utm_source=boxsite&utm_medium=referral&utm_campaign=boxes`,
  }
}

const run = async () => {
  const links = new Set<string>()

  for (const url of CATEGORY_URLS) {
    const html = await fetchWithRetry(url)
    extractProductLinks(html).forEach((link) => links.add(link))
    await sleep(RATE_LIMIT_MS)
  }

  const results = [] as Array<Record<string, unknown>>

  for (const link of links) {
    const data = await parseProductPage(link)
    results.push(data)
    await sleep(RATE_LIMIT_MS)
  }

  const outPath = resolve('data/boxes.json')
  writeFileSync(outPath, JSON.stringify(results, null, 2))
  console.log(`Saved ${results.length} boxes to ${outPath}`)
}

run().catch((error) => {
  console.error('Scrape failed', error)
  process.exit(1)
})
