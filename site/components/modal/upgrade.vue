<script setup lang="ts">
const props = defineProps<{
  disabled: boolean;
}>();
const project = useProjectStore();

const { version, limit, segments, isValid, update } = useVersionHook(project.version);
const log = ref('');

const handleVersionUpdate = async () => {
  if (!isValid.value) {
    return;
  }
  await useFetch(`/api/v1/project/${project.id}/upgrade`, {
    method: 'POST',
    body: JSON.stringify({
      version: version.value,
      log: log.value,
    }),
  });
  project.version = version.value;
  update();
  visible.value = false;
};

const visible = ref(false);
const handleClick = () => {
  if (props.disabled) {
    return;
  }
  visible.value = !visible.value;
};
</script>

<template>
  <i
    class="soft--icon"
    :title="disabled ? '配置不正确，无法打包' : '升级'"
    @click="handleClick"
    :data-disabled="disabled"
  >
    <IconUpgrade></IconUpgrade>
  </i>
  <Modal v-model:visible="visible">
    <form class="soft--form modal-form">
      <div class="title">版本升级</div>
      <div class="form-item">
        <label for="version">版本号</label>
        <input
          type="number"
          :min="limit.major"
          v-model="segments.major"
          class="soft--box soft--input version"
        />
        <input
          type="number"
          :min="limit.minor"
          v-model="segments.minor"
          class="soft--box soft--input version"
        />
        <input
          type="number"
          :min="limit.patch"
          v-model="segments.patch"
          class="soft--box soft--input version"
        />
      </div>
      <div class="form-item">
        <label for="component">日志</label>
        <textarea name="component" v-model="log" class="soft--box soft--input textarea"></textarea>
      </div>
      <div class="form-item submit">
        <button
          class="soft--box soft--button"
          :disabled="!isValid"
          @click.stop.prevent="handleVersionUpdate"
        >
          发布
        </button>
      </div>
    </form>
  </Modal>
</template>

<style lang="less" scoped>
.soft--form {
  .textarea {
    min-height: 150px;
  }
  .version {
    width: 30px;
  }
  button[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
