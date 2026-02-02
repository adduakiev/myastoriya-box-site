<template>
  <section class="hero">
    <p class="eyebrow">Pick a box in 20 seconds</p>
    <h1>Choose the perfect Myastoriya Box with fast filters.</h1>
    <p>From office breaks to picnic adventures — curated food boxes with clear sizes, price, and occasion tags.</p>
    <div class="hero-actions">
      <NuxtLink class="primary" to="/catalog">Start in catalog</NuxtLink>
      <NuxtLink class="ghost" to="/occasion/office">Browse occasions</NuxtLink>
    </div>
  </section>

  <section>
    <h2 class="section-title">Best for your moments</h2>
    <div class="use-cases">
      <div class="use-card">
        <h3>Office & corporate</h3>
        <p>Quick sharing formats for meetings, team lunches, and corporate gifting.</p>
      </div>
      <div class="use-card">
        <h3>Home & family</h3>
        <p>Cozy boxes for movie nights, birthdays, and warm gatherings.</p>
      </div>
      <div class="use-card">
        <h3>Outdoor & picnic</h3>
        <p>Lightweight boxes that are easy to bring and even easier to enjoy.</p>
      </div>
    </div>
  </section>

  <section>
    <h2 class="section-title">Bestsellers</h2>
    <div class="grid">
      <BoxCard v-for="box in featured" :key="box.id" :box="box" />
    </div>
  </section>
</template>

<script setup lang="ts">
const boxes = useBoxes()
const featured = boxes.slice(0, 3)

useHead({
  title: 'Myastoriya Boxes — pick a box in 20 seconds',
  meta: [
    { name: 'description', content: 'Pick a Myastoriya Box in 20 seconds. Filter by occasion, price, and format.' },
    { property: 'og:title', content: 'Pick a Myastoriya Box in 20 seconds' },
    { property: 'og:description', content: 'Fast filters, curated boxes, and quick CTA to the main Myastoriya store.' },
  ],
})
</script>
