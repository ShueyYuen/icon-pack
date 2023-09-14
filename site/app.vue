<script setup>
import 'reset-css';

useHead({
  title: 'icon-pack',
  link: [
    {
      rel: 'icon',
      type: 'image/ico',
      sizes: '32x32',
      href: 'https://www.shuey.fun/favicon.ico',
    },
  ],
});
</script>

<template>
  <NuxtPage></NuxtPage>
</template>

<style lang="less">
body {
  background-color: var(--theme-bg-primary);
  color: var(--theme-text-primary);
}
#__nuxt {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
}
</style>
