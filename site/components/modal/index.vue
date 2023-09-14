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
    <div class="modal-mask" v-if="props.visible" @click="handleClose">
      <div class="soft--box modal-container" @click.stop>
        <slot v-bind="{ close: handleClose }"></slot>
      </div>
    </div>
  </Teleport>
</template>

<style lang="less">
.modal-mask {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0,.5);
  line-height: 24px;

  .modal-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 15px;
    color: var(--theme-text-primary);
  }
}
</style>
