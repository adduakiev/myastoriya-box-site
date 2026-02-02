<template>
  <div class="filter-sheet" :class="{ open: isOpen }">
    <div class="sheet-backdrop" @click="close"></div>
    <div class="sheet-panel" role="dialog" aria-modal="true">
      <header>
        <h2>Filters</h2>
        <button type="button" class="ghost" @click="close">Close</button>
      </header>
      <section>
        <h3>Occasion</h3>
        <div class="chip-group">
          <label v-for="option in occasions" :key="option" class="chip">
            <input type="checkbox" :value="option" v-model="localFilters.occasion" />
            <span>{{ formatTag(option) }}</span>
          </label>
        </div>
      </section>
      <section>
        <h3>Format</h3>
        <div class="chip-group">
          <label v-for="option in formats" :key="option" class="chip">
            <input type="checkbox" :value="option" v-model="localFilters.format" />
            <span>{{ formatTag(option) }}</span>
          </label>
        </div>
      </section>
      <section>
        <h3>Persons</h3>
        <div class="range">
          <input type="range" min="2" max="12" step="1" v-model.number="localFilters.persons" />
          <span>{{ localFilters.persons || 2 }}+</span>
        </div>
      </section>
      <section>
        <h3>Max Price (₴)</h3>
        <div class="range">
          <input type="range" min="800" max="3000" step="50" v-model.number="localFilters.priceMax" />
          <span>{{ localFilters.priceMax?.toLocaleString('uk-UA') || 3000 }}</span>
        </div>
      </section>
      <footer>
        <button type="button" class="ghost" @click="reset">Reset</button>
        <button type="button" class="primary" @click="apply">Apply</button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FiltersState } from '~/types/filters'

const props = defineProps<{
  filters: FiltersState
  occasions: string[]
  formats: string[]
}>()

const emit = defineEmits<{
  (event: 'apply', value: FiltersState): void
  (event: 'reset'): void
}>()

const { isOpen, close } = useFilterSheet()
const localFilters = reactive<FiltersState>({
  occasion: [...props.filters.occasion],
  format: [...props.filters.format],
  persons: props.filters.persons,
  priceMax: props.filters.priceMax,
})

watch(
  () => props.filters,
  (next) => {
    localFilters.occasion = [...next.occasion]
    localFilters.format = [...next.format]
    localFilters.persons = next.persons
    localFilters.priceMax = next.priceMax
  },
  { deep: true }
)

const formatTag = (tag: string) => tag.replace('-', ' ')

const reset = () => {
  emit('reset')
  close()
}

const apply = () => {
  emit('apply', {
    occasion: [...localFilters.occasion],
    format: [...localFilters.format],
    persons: localFilters.persons,
    priceMax: localFilters.priceMax,
  })
  close()
}
</script>
