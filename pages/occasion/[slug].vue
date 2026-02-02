<template>
  <section class="occasion-hero">
    <p class="eyebrow">Occasion</p>
    <h1>{{ occasion.title }}</h1>
    <p>{{ occasion.description }}</p>
    <NuxtLink class="primary" to="/catalog">View all boxes</NuxtLink>
  </section>

  <section>
    <h2 class="section-title">Recommended boxes</h2>
    <div class="grid">
      <BoxCard v-for="box in filtered" :key="box.id" :box="box" />
    </div>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug)

const occasionMap: Record<string, { title: string; description: string }> = {
  office: {
    title: 'Office Boxes',
    description: 'Team-friendly boxes for meetings, workshops, and office celebrations.',
  },
  home: {
    title: 'Home Boxes',
    description: 'Cozy boxes for family dinners, movie nights, and relaxed get-togethers.',
  },
  picnic: {
    title: 'Picnic Boxes',
    description: 'Light, portable boxes that travel well and keep the vibe outdoors.',
  },
  birthday: {
    title: 'Birthday Boxes',
    description: 'Celebrate birthdays with sweet and savory bites ready to share.',
  },
  corporate: {
    title: 'Corporate Boxes',
    description: 'Professional boxes for clients, partners, and corporate gifting.',
  },
  'march-8': {
    title: 'March 8 Boxes',
    description: 'Elegant spring boxes curated for March 8 celebrations.',
  },
}

const occasion = occasionMap[slug] || {
  title: 'Occasion Boxes',
  description: 'Curated boxes for every occasion.',
}

const boxes = useBoxes()
const filtered = boxes.filter((box) => box.occasion_tags.includes(slug))

useHead({
  title: `${occasion.title} — Myastoriya Boxes`,
  meta: [
    { name: 'description', content: occasion.description },
    { property: 'og:title', content: occasion.title },
  ],
})
</script>
