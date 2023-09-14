<script setup lang="ts">
import { EditableProject, IIcon, editableProjectKey } from '@icon/schema';
import { isNil, pick } from 'lodash-unified';

const props = withDefaults(
  defineProps<{
    example?: IIcon;
    project?: EditableProject;
    create?: boolean;
    validate?: boolean;
    readonly?: boolean;
  }>(),
  {
    example: () =>
      ({
        svg: '<svg viewBox="0 0 1024 1024"><path d="M770.56 460.8h250.88C998.4 220.16 803.84 25.6 563.2 2.56v250.88c104.96 20.48 186.88 102.4 207.36 207.36zM460.8 253.44V2.56C220.16 25.6 25.6 220.16 2.56 460.8h250.88c20.48-104.96 102.4-186.88 207.36-207.36z m102.4 517.12v250.88c243.2-23.04 435.2-217.6 460.8-460.8H773.12C750.08 668.16 668.16 750.08 563.2 770.56zM253.44 563.2H2.56c23.04 243.2 217.6 435.2 460.8 460.8V773.12C355.84 750.08 273.92 668.16 253.44 563.2z m0 0"></path></svg>',
        name: 'example',
        class: 'example',
      } as IIcon),
    project: () =>
      ({
        name: '',
        description: '',
        prefix: '',
        family: '',
      } as EditableProject),
    validate: undefined,
  }
);

const emit = defineEmits<{
  (e: 'patch:project', project: EditableProject): void;
  (e: 'update:validate', validate: boolean): void;
}>();

const visible = ref(false);
const toggleVisible = () => (visible.value = !visible.value);
const handleClick = () => {
  toggleVisible();
  !visible.value && emit('patch:project', project.value!);
};

const project = ref<EditableProject>();

const nameReg = /^[a-z]+(-[a-z]+)*$/;
const pattern = nameReg.toString().substring(1, nameReg.toString().length - 1);

const innerValid = computed(() => {
  if (project.value) {
    const { name, prefix, family } = project.value;
    return !!(name && prefix && nameReg.test(prefix) && family && nameReg.test(family));
  }
  return false;
});

const validate = computed(() => (isNil(props.validate) ? innerValid.value : props.validate));

watch(innerValid, (value) => emit('update:validate', value), { immediate: true });

watch(
  () => props.project,
  (value) => (project.value = pick(value, editableProjectKey)),
  { immediate: true }
);

watch(visible, (value) => !value && (project.value = pick(props.project, editableProjectKey)));

const title = computed(() => (props.create ? '创建项目' : '预览配置'));
</script>

<template>
  <i class="soft--icon" :title="validate ? title : '配置不正确，需修改'" @click="toggleVisible">
    <IconCreate v-if="create"></IconCreate>
    <IconSetting v-else :class="{ warning: !validate }"></IconSetting>
  </i>
  <Modal v-model:visible="visible">
    <div class="soft--form modal-form">
      <div class="title">{{ title }}</div>
      <div class="form-item">
        <label for="component">预览</label>
        <ul class="preview">
          <IconContent
            :icon="example"
            :font="project.family"
            :component="project.prefix"
          ></IconContent>
        </ul>
      </div>
      <div class="form-item">
        <label for="name">项目名称</label>
        <input
          type="text"
          name="name"
          class="soft--box soft--input"
          required
          :readonly="readonly"
          v-model="project.name"
          autocomplete="off"
        />
      </div>
      <div class="form-item">
        <label for="prefix">组件前缀</label>
        <input
          type="text"
          name="prefix"
          class="soft--box soft--input"
          :pattern="pattern"
          required
          :readonly="readonly"
          v-model="project.prefix"
          autocomplete="off"
        />
      </div>
      <div class="form-item">
        <label for="family">图标族</label>
        <input
          type="text"
          name="family"
          class="soft--box soft--input"
          :pattern="pattern"
          required
          :readonly="readonly"
          v-model="project.family"
          autocomplete="off"
        />
      </div>
      <div class="form-item">
        <label for="id">描述</label>
        <textarea
          name="component"
          v-model="project.description"
          :readonly="readonly"
          class="soft--box soft--input textarea"
        ></textarea>
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
.warning {
  color: var(--theme-warning);
}
</style>
