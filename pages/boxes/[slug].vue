<template>
  <section v-if="box" class="detail">
    <div class="detail-gallery">
      <img v-for="(image, index) in box.images" :key="index" :src="image" :alt="box.title" />
    </div>
    <div class="detail-info">
      <h1>{{ box.title }}</h1>
      <div class="detail-meta">
        <span>{{ box.weight_g }} g</span>
        <span>{{ box.persons_min }}-{{ box.persons_max }} persons</span>
        <span>{{ formatPrice(box.price_uah) }}</span>
      </div>
      <div v-html="box.description_html"></div>
      <p><strong>Composition:</strong> {{ box.composition_text }}</p>
      <div class="detail-cta">
        <a class="primary" :href="box.buy_url" @click="trackBuy" target="_blank" rel="noreferrer">
          Buy on Myastoriya.com.ua
        </a>
        <NuxtLink class="ghost" to="/catalog">Back to catalog</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
const { trackEvent } = useAnalytics()
const boxes = useBoxes()
const slug = String(route.params.slug)
const box = boxes.find((item) => item.slug === slug)

if (!box) {
  throw createError({ statusCode: 404, statusMessage: 'Box not found' })
}

const formatPrice = (value: number) => `${value.toLocaleString('uk-UA')} ₴`

const trackBuy = () => {
  trackEvent('cta_click', { slug: box.slug, location: 'detail' })
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: box.title,
  image: box.images,
  description: box.description_html.replace(/<[^>]+>/g, ''),
  sku: box.id,
  offers: {
    '@type': 'Offer',
    priceCurrency: 'UAH',
    price: box.price_uah,
    url: box.canonical_url,
    availability: 'https://schema.org/InStock',
  },
  weight: {
    '@type': 'QuantitativeValue',
    value: box.weight_g,
    unitText: 'g',
  },
}

useHead({
  title: `${box.title} — Myastoriya Boxes`,
  meta: [
    { name: 'description', content: box.description_html.replace(/<[^>]+>/g, '').slice(0, 155) },
    { property: 'og:title', content: box.title },
    { property: 'og:description', content: box.description_html.replace(/<[^>]+>/g, '') },
    { property: 'og:image', content: box.images[0] },
    { property: 'twitter:image', content: box.images[0] },
  ],
  link: [
    { rel: 'canonical', href: box.canonical_url },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(jsonLd),
    },
  ],
})
</script>
