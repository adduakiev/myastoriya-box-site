<template>
  <section class="catalog-hero">
    <h1>Catalog</h1>
    <p>Filter by occasion, format, persons, and price to find the perfect box.</p>
    <div class="filter-bar">
      <span class="filter-pill">Persons: {{ filters.persons || 2 }}+</span>
      <span class="filter-pill">Max: {{ filters.priceMax?.toLocaleString('uk-UA') || 3000 }} ₴</span>
      <span v-if="filters.occasion.length" class="filter-pill">Occasion: {{ filters.occasion.join(', ') }}</span>
      <span v-if="filters.format.length" class="filter-pill">Format: {{ filters.format.join(', ') }}</span>
    </div>
    <p class="catalog-count">{{ filtered.length }} boxes</p>
  </section>

  <section>
    <div class="grid">
      <BoxCard v-for="box in filtered" :key="box.id" :box="box" />
    </div>
  </section>

  <FilterSheet
    :filters="filters"
    :occasions="occasionOptions"
    :formats="formatOptions"
    @apply="applyFilters"
    @reset="resetFilters"
  />
</template>

<script setup lang="ts">
import type { FiltersState } from '~/types/filters'

const { trackEvent } = useAnalytics()
const boxes = useBoxes()
const occasionOptions = Array.from(new Set(boxes.flatMap((box) => box.occasion_tags)))
const formatOptions = Array.from(new Set(boxes.flatMap((box) => box.format_tags)))

const filters = reactive<FiltersState>({
  occasion: [],
  format: [],
  persons: 2,
  priceMax: 3000,
})

const applyFilters = (next: FiltersState) => {
  filters.occasion = next.occasion
  filters.format = next.format
  filters.persons = next.persons
  filters.priceMax = next.priceMax

  trackEvent('filters_applied', {
    occasions: filters.occasion.join(','),
    formats: filters.format.join(','),
    persons: filters.persons || 0,
    priceMax: filters.priceMax || 0,
  })
}

const resetFilters = () => {
  filters.occasion = []
  filters.format = []
  filters.persons = 2
  filters.priceMax = 3000
  trackEvent('filters_reset')
}

const filtered = computed(() => {
  return boxes.filter((box) => {
    if (filters.occasion.length && !filters.occasion.some((tag) => box.occasion_tags.includes(tag))) {
      return false
    }
    if (filters.format.length && !filters.format.some((tag) => box.format_tags.includes(tag))) {
      return false
    }
    if (filters.persons && box.persons_max < filters.persons) {
      return false
    }
    if (filters.priceMax && box.price_uah > filters.priceMax) {
      return false
    }
    return true
  })
})

useHead({
  title: 'Catalog — Myastoriya Boxes',
  meta: [
    { name: 'description', content: 'Browse all Myastoriya Boxes and filter by occasion, format, persons, and price.' },
    { property: 'og:title', content: 'Myastoriya Boxes Catalog' },
  ],
})
</script>
