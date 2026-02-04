<template>
  <header class="site-header">
    <NuxtLink class="logo" to="/" aria-label="Myastoriya Boxes">
      <img src="https://myastoriya.com.ua/frontend/myastoriya/dist/images/logo.png" alt="Myastoriya Boxes" />
    </NuxtLink>
    <div class="header-actions">
      <a class="header-link" href="https://myastoriya.com.ua" target="_blank" rel="noreferrer">
        Back to Myastoriya.com.ua
      </a>
      <a class="header-call" :href="`tel:${phoneTel}`">Call {{ phoneDisplay }}</a>
    </div>
  </header>
</template>

<script setup lang="ts">
const phoneDisplay = '+380 (67) 463-63-63'
const phoneTel = '+380674636363'
</script>
