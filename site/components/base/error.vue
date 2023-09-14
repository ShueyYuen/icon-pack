<script setup lang="ts">
const props = defineProps<{
  message: String 
}>()
</script>

<template>
  <div class="error-container">{{ props.message }}</div>
</template>
