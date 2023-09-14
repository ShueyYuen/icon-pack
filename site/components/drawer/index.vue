<script setup lang="ts">
const props = defineProps<{
  visible: Boolean;
}>();

const emit = defineEmits(['update:visible', 'close']);

const handleClose = (e: MouseEvent) => {
  emit('update:visible', false);
  emit('close', e);
};
</script>

<template>
  <Teleport to="body">
    <div class="soft--box drawer-container" @click.stop v-if="visible">
      <div class="close" @click="handleClose"></div>
      <slot v-bind="{ close: handleClose }"></slot>
    </div>
  </Teleport>
</template>

<style lang="less">
.drawer-container {
  position: fixed;
  z-index: 20;
  top: 75px;
  border-radius: var(--radius) 0 0 var(--radius);
  bottom: 75px;
  right: 0;
  padding: 15px;
  color: var(--theme-text-primary);
  overflow: visible;
  min-width: 380px;
  display: flex;
  flex-direction: column;
}
</style>
