<script setup lang="ts">
import { debounce } from 'lodash-unified';
import { Types } from 'mongoose';
import { optimizeSvg } from '@icon/utils';
import { IIcon } from '~/server/models';

type InnerIcon = IIcon & { colorful: boolean; component: string };
const props = defineProps<{
  icon: InnerIcon;
}>();

const emit = defineEmits(['update:icon']);

const inner = ref<InnerIcon>();

const icon = computed({
  get: () => inner.value ?? props.icon,
  set: (value) => (inner.value = value),
});
const visible = ref(false);
const nameReg = /^[a-z]+(-[a-z]+)*$/;
const pattern = nameReg.toString().substring(1, nameReg.toString().length - 1);
const validate = computed(() => {
  if (icon.value.class) {
    return nameReg.test(icon.value.class);
  }
  return false;
});

const handleClick = () => {
  if (!validate.value) {
    return;
  }
  visible.value = !visible.value;
  if (!visible.value) {
    inner.value && emit('update:icon', inner.value);
    inner.value = undefined;
  }
};

const project = useProjectStore();
const debounceCheckName = debounce((name: string) => {
  const { data } = useFetch(`/api/v1/project/${project.id}/icon/check-name`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}, 500);

const patchIcon = (event: Event | string, property: keyof InnerIcon) => {
  const value =
    typeof event === 'string' ? event : ((event as InputEvent).target! as HTMLInputElement).value;
  icon.value = {
    ...icon.value,
    [property]: value,
  };
  if (property === 'class') {
    debounceCheckName(value);
  }
};

const dropZone = ref();
const { click, files } = useUploadHook<IIcon>(dropZone, {
  accept: '.svg',
  multiple: false,
  fileParse: (file: File) => {
    if (file.type !== 'image/svg+xml') {
      return;
    }
    const reader = new FileReader();
    const result = new Promise((resolve) => {
      reader.addEventListener('load', (e) => {
        const svgContent = e.target?.result as string;
        const name = file.name.split('.')[0];
        resolve({
          id: '',
          name,
          project: new Types.ObjectId(project.id),
          class: name,
          svg: optimizeSvg(svgContent),
        });
      });
    }) as Promise<IIcon>;
    reader.readAsText(file);
    return result;
  },
});

watch(
  () => files.value[0],
  (value) => patchIcon(value.svg, 'svg')
);
</script>

<template>
  <i class="soft--icon" title="编辑图标" @click="visible = true">
    <IconEdit></IconEdit>
  </i>
  <Modal v-model:visible="visible">
    <div class="soft--form modal-form">
      <div class="title">{{ icon.component }}</div>
      <div class="form-item" v-if="icon">
        <label for="component">预览</label>
        <ul class="preview">
          <IconContent
            ref="dropZone"
            @click="click"
            :icon="icon"
            :font="project.family"
            :component="project.prefix"
          ></IconContent>
        </ul>
      </div>
      <div class="form-item">
        <label for="font">展示名称</label>
        <input
          type="text"
          name="font"
          class="soft--box soft--input"
          :value="icon.name"
          @input="patchIcon($event, 'name')"
          required
          autocomplete="off"
        />
      </div>
      <div class="form-item">
        <label for="component">图标名称</label>
        <input
          type="text"
          name="component"
          class="soft--box soft--input"
          :pattern="pattern"
          :value="icon.class"
          @input="patchIcon($event, 'class')"
          required
          autocomplete="off"
        />
      </div>
      <div class="form-item submit">
        <button class="soft--box soft--button" @click="handleClick" :disabled="!validate">
          确认
        </button>
      </div>
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.soft--form {
  .preview {
    &::after {
      content: '点击或拖拽更换图标';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      white-space: nowrap;
      background: var(--theme-bg-shadow);
      padding: 10px;
      border-radius: var(--radius);
      opacity: 0.4;
      pointer-events: none;
    }
    :deep(.icon-container) {
      box-sizing: border-box;
    }
    :deep(.drop) {
      border: 1px dashed var(--theme-text-active);
    }
  }
}
</style>
