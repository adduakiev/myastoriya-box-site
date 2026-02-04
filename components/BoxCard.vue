<template>
  <article class="box-card">
    <NuxtLink :to="`/boxes/${box.slug}`" class="box-card__image">
      <img
        :src="imgSrc"
        :alt="box.title"
        loading="lazy"
        decoding="async"
        @error="onImgError"
      />
      <span v-if="personsLabel" class="badge">{{ personsLabel }}</span>
    </NuxtLink>

    <div class="box-card__body">
      <h3>{{ box.title }}</h3>

      <p class="box-card__meta">
        <span v-if="box.weight_g && box.weight_g > 0">{{ box.weight_g }} г</span>
        <span>{{ formatPrice(box.price_uah) }}</span>
      </p>

      <ul v-if="box.format_tags?.length" class="box-card__bullets">
        <li v-for="tag in box.format_tags.slice(0, 2)" :key="tag">{{ formatTag(tag) }}</li>
      </ul>

      <div class="box-card__actions">
        <NuxtLink class="ghost" :to="`/boxes/${box.slug}`">Деталі</NuxtLink>
        <a class="primary" :href="box.buy_url" @click="trackBuy" target="_blank" rel="noreferrer">
          Купити
        </a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Box } from '~/types/box'

const props = defineProps<{ box: Box }>()
const { trackEvent } = useAnalytics()

const FALLBACK = '/img/box-placeholder.png'

const toProxy = (url: string) =>
  url?.startsWith('https://myastoriya.com.ua/')
    ? url.replace('https://myastoriya.com.ua/', '/mimg/')
    : url

// беремо найкраще прев’ю для картки (часто є 400x300), інакше перше
const rawImage = computed(() => {
  const imgs = props.box.images ?? []
  return imgs.find(u => u.includes('/400_300_1/')) || imgs[0] || ''
})

const imgSrc = ref(FALLBACK)

watchEffect(() => {
  imgSrc.value = rawImage.value ? toProxy(rawImage.value) : FALLBACK
})

const onImgError = () => {
  imgSrc.value = FALLBACK
}

const personsLabel = computed(() => {
  const min = props.box.persons_min || 0
  const max = props.box.persons_max || 0
  if (!min || !max) return null
  return min === max ? `${min} порцій` : `${min}–${max} порцій`
})

const formatPrice = (value: number) => `${value.toLocaleString('uk-UA')} ₴`
const formatTag = (tag: string) => tag.replace(/-/g, ' ')

const trackBuy = () => {
  trackEvent('cta_click', { slug: props.box.slug, location: 'card' })
}
</script>
