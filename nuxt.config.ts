import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const siteUrl = 'https://box.myastoriya.com.ua'

const boxesPath = resolve('data/boxes.json')
const boxes = JSON.parse(readFileSync(boxesPath, 'utf-8')) as Array<{ slug: string }>
const occasionSlugs = ['office', 'home', 'picnic', 'birthday', 'corporate', 'march-8']

export default defineNuxtConfig({
  ssr: true,
  typescript: {
    strict: true,
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Myastoriya Boxes — pick a box in 20 seconds',
      meta: [
        { name: 'description', content: 'Pick a Myastoriya Box in 20 seconds. Find the right format, occasion, and price with quick filters.' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                        { property: 'og:type', content: 'website' },
                                { property: 'og:site_name', content: 'Myastoriya Boxes' },
                                        { property: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/brand/logo.svg' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      siteUrl,
      analyticsProvider: process.env.NUXT_PUBLIC_ANALYTICS_PROVIDER || '',
    },
  },
  nitro: {
    preset: 'static',
    prerender: {
      routes: [
        '/',
        '/catalog',
        ...occasionSlugs.map((slug) => `/occasion/${slug}`),
        ...boxes.map((box) => `/boxes/${box.slug}`),
      ],
    },
  },
})
