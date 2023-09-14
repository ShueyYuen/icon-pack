<script setup lang="ts">
const props = defineProps<{
  id?: string;
  src?: string;
}>();

const src = computed(() => {
  if (props.src) {
    return `data:image/jpeg;base64,${props.src}`;
  }
  if (props.id) {
    return `/api/v1/avatar/${props.id}.jpeg`;
  }
  return '/default.jpeg';
})
</script>

<template>
  <img :src="src" class="avatar" />
</template>
