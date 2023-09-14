<script setup lang="ts">
defineProps<{ title: string }>();
const emit = defineEmits(['delete']);

const visible = ref(false);
const toggleVisible = () => (visible.value = !visible.value);
const handleClick = () => {
  toggleVisible();
  if (!visible.value) {
    emit('delete');
  }
};
</script>

<template>
  <i
    class="soft--icon"
    :title="title"
    @click="toggleVisible"
    v-bind="$attrs"
    style="color: var(--theme-error)"
  >
    <IconDelete></IconDelete>
  </i>
  <Modal v-model:visible="visible">
    <div class="soft--form">
      <div>删除后将不可恢复</div>
      <div class="form-item submit">
        <button class="soft--box soft--button" @click="toggleVisible">取消</button>
        <button class="soft--box soft--button error" @click="handleClick">确认</button>
      </div>
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.soft--form {
  font-size: 16px;
  padding: 10px;
  min-height: 150px;
  .title {
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
  .form-item label {
    width: 65px;
  }
}
</style>
