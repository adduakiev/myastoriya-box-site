<template>
  <article class="box-card">
    <NuxtLink :to="`/boxes/${box.slug}`" class="box-card__image">
      <!-- Image OR Placeholder -->
      <img
        v-if="showImage"
        :src="imageSrc"
        :alt="box.title"
        loading="lazy"
        @error="onImgError"
      />
      <div v-else class="box-card__image-placeholder" aria-hidden="true">
        <div class="box-card__ph-title">{{ box.title }}</div>
        <div class="box-card__ph-sub">Фото додамо найближчим часом</div>
      </div>

      <span v-if="personsLabel" class="badge">{{ personsLabel }}</span>
    </NuxtLink>

    <div class="box-card__body">
      <h3>{{ box.title }}</h3>

      <p class="box-card__meta">
        <span>{{ box.weight_g }} g</span>
        <span>{{ formatPrice(box.price_uah) }}</span>
      </p>

      <ul class="box-card__bullets">
        <li v-for="tag in (box.format_tags || []).slice(0, 2)" :key="tag">{{ formatTag(tag) }}</li>
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

const imgOk = ref(true)

const imageSrc = computed(() => {
  const src = props.box?.images?.[0]
  return typeof src === 'string' && src.trim().length > 5 ? src : ''
})

const showImage = computed(() => Boolean(imageSrc.value) && imgOk.value)

const onImgError = () => {
  imgOk.value = false
}

const personsLabel = computed(() => {
  const min = Number(props.box?.persons_min ?? 0)
  const max = Number(props.box?.persons_max ?? 0)

  // якщо дані не заповнені — краще не показувати бейдж взагалі
  if (min === 0 && max === 0) return ''

  if (min > 0 && max > 0) return `${min}–${max} осіб`
  if (max > 0 && min === 0) return `до ${max} осіб`
  if (min > 0 && max === 0) return `від ${min} осіб`

  return ''
})

const formatPrice = (value: number) => `${value.toLocaleString('uk-UA')} ₴`
const formatTag = (tag: string) => tag.replaceAll('-', ' ').replaceAll('_', ' ')

const trackBuy = () => {
  trackEvent('cta_click', { slug: props.box.slug, location: 'card' })
}
</script>

<style scoped>
/* Мінімальний стиль плейсхолдера, щоб не було "битого" вигляду */
.box-card__image-placeholder {
  width: 100%;
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 14px;
  border-radius: 16px;
  background: radial-gradient(1200px 400px at 20% 0%, #ffffff 0%, #f4f4f5 55%, #efeff1 100%);
}

.box-card__ph-title {
  font-weight: 700;
  line-height: 1.2;
}

.box-card__ph-sub {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.7;
}
</style>
