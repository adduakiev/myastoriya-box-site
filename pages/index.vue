<template>
  <section class="hero">
    <p class="eyebrow">Обери бокс за 20 секунд</p>
    <h1>Підбери ідеальний Myastoriya Box швидкими фільтрами.</h1>
    <p>
      Для офісу, дому чи пікніка — готові бокси з зрозумілим форматом, вагою, ціною та тегами по нагоді.
    </p>
    <div class="hero-actions">
      <NuxtLink class="primary" to="/catalog">Перейти в каталог</NuxtLink>
      <NuxtLink class="ghost" to="/occasion/office">Обрати привід</NuxtLink>
    </div>
  </section>

  <section>
    <h2 class="section-title">Найкраще для моментів</h2>
    <div class="use-cases">
      <div class="use-card">
        <h3>Офіс & корпоратив</h3>
        <p>Швидкі формати для зустрічей, командних обідів та корпоративних подарунків.</p>
      </div>
      <div class="use-card">
        <h3>Дім & сімʼя</h3>
        <p>Затишні бокси для кіно-вечора, дня народження і теплих зустрічей.</p>
      </div>
      <div class="use-card">
        <h3>Пікнік & природа</h3>
        <p>Зручно взяти з собою — легко розкласти й насолоджуватись.</p>
      </div>
    </div>
  </section>

  <section>
    <h2 class="section-title">Хіти</h2>
    <div class="grid">
      <BoxCard v-for="box in featured" :key="box.id" :box="box" />
    </div>
  </section>
</template>

<script setup lang="ts">
const boxes = useBoxes()
const featured = boxes.slice(0, 8)

useHead({
  title: 'Myastoriya Boxes — обери бокс за 20 секунд',
  meta: [
    { name: 'description', content: 'Підбір боксів Myastoriya за 20 секунд. Фільтри по нагоді, формату та ціні.' },
    { property: 'og:title', content: 'Myastoriya Boxes — обери бокс за 20 секунд' },
    { property: 'og:description', content: 'Швидкі фільтри, готові бокси і швидкий перехід до покупки.' },
  ],
})
</script>
