<script setup lang="ts">
const emit = defineEmits(["decolorize"]);

const visible = ref(false);
const toggleVisible = () => (visible.value = !visible.value);
const handleClick = () => {
  toggleVisible();
  if (!visible.value) {
    emit("decolorize");
  }
};
</script>

<template>
  <i class="soft--icon" title="去色" @click="toggleVisible">
    <IconDecolorize></IconDecolorize>
  </i>
  <Modal v-model:visible="visible">
    <div class="soft--form">
      <div>去除颜色后将不可恢复</div>
      <div class="form-item submit">
        <button class="soft--box soft--button" @click="toggleVisible">
          取消
        </button>
        <button class="soft--box soft--button error" @click="handleClick">
          确认
        </button>
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
