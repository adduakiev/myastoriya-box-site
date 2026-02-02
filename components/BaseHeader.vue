<template>
  <header class="site-header">
    <NuxtLink class="logo" to="/" aria-label="Myastoriya Boxes">
      <img src="/brand/logo.svg" alt="Myastoriya Boxes" />
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
const phoneDisplay = '+380 (44) 290-02-02'
const phoneTel = '+380442900202'
</script>
