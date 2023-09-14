<script setup lang="ts">
const props = defineProps<{ loading: Boolean }>();

const pageLoaded = ref(false);
const nuxtApp = useNuxtApp();
nuxtApp.hook('page:finish', () => {
  pageLoaded.value = true;
})
</script>

<template>
  <slot :name="pageLoaded && !props.loading ? 'default' : 'loading'">
    <div class="loading-container">
      <div v-for="i in 15" class="soft--box card"></div>
    </div>
  </slot>
</template>

<style lang="less" scoped>
.loading-container {
  display: flex;
  flex-wrap: wrap;
  width: 240px;
  align-items: center;
  justify-content: center;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.card {
  width: 40px;
  height: 40px;
  border-top-left-radius: 10px;
  transition: 0.4s ease-in-out, 0.2s background-color;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  margin: 4px;
  animation: 2s loading-blink infinite;
  &:nth-child(odd) {
    animation: 2s loading-blink -1s infinite;
  }
}

@keyframes loading-blink {
  50% {
    background: var(--theme-text-active);
  }
}
</style>
