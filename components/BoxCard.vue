<template>
  <article class="box-card">
    <NuxtLink :to="`/boxes/${box.slug}`" class="box-card__image">
      <img :src="box.images[0]" :alt="box.title" loading="lazy" />
      <span class="badge">{{ personsLabel }}</span>
    </NuxtLink>
    <div class="box-card__body">
      <h3>{{ box.title }}</h3>
      <p class="box-card__meta">
        <span>{{ box.weight_g }} g</span>
        <span>{{ formatPrice(box.price_uah) }}</span>
      </p>
      <ul class="box-card__bullets">
        <li v-for="tag in box.format_tags.slice(0, 2)" :key="tag">{{ formatTag(tag) }}</li>
      </ul>
      <div class="box-card__actions">
        <NuxtLink class="ghost" :to="`/boxes/${box.slug}`">Details</NuxtLink>
        <a class="primary" :href="box.buy_url" @click="trackBuy" target="_blank" rel="noreferrer">Buy</a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Box } from '~/types/box'

const props = defineProps<{ box: Box }>()
const { trackEvent } = useAnalytics()

const personsLabel = computed(() => `${props.box.persons_min}-${props.box.persons_max} persons`)

const formatPrice = (value: number) => `${value.toLocaleString('uk-UA')} ₴`
const formatTag = (tag: string) => tag.replace('-', ' ')

const trackBuy = () => {
  trackEvent('cta_click', { slug: props.box.slug, location: 'card' })
}
</script>
