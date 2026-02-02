<template>
  <nav class="bottom-nav">
    <NuxtLink to="/catalog">Catalog</NuxtLink>
    <button type="button" @click="openFilter">Filter</button>
    <NuxtLink to="/occasion/office">Occasions</NuxtLink>
    <a :href="`tel:${phoneTel}`">Call</a>
    <a v-if="featured" :href="featured.buy_url" @click="trackBuy" target="_blank" rel="noreferrer">
      Buy
    </a>
  </nav>
</template>

<script setup lang="ts">
const phoneTel = '+380442900202'
const { open } = useFilterSheet()
const { trackEvent } = useAnalytics()
const boxes = useBoxes()
const featured = boxes[0]

const openFilter = () => {
  open()
  trackEvent('filter_opened', { source: 'bottom_nav' })
}

const trackBuy = () => {
  if (!featured) return
  trackEvent('cta_click', { slug: featured.slug, location: 'bottom_nav' })
}
</script>
