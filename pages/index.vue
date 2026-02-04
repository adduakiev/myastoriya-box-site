<script setup lang="ts">
const boxes = useBoxes()

// показуємо більше і спочатку ті, що з фото
const featured = computed(() =>
  boxes
    .filter(b => (b.images?.length ?? 0) > 0)
    .slice(0, 6)
)

useHead({
  title: 'Бокси Мʼясторія — обери за 20 секунд',
  meta: [
    { name: 'description', content: 'Швидкий підбір боксу Мʼясторія за приводом, ціною та форматом.' },
    { property: 'og:title', content: 'Бокси Мʼясторія — обери за 20 секунд' },
    { property: 'og:description', content: 'Фільтри, добірки та швидкий перехід до покупки.' }
  ]
})
</script>
