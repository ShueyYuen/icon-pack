<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { decolorize } from '@icon/utils';
import { IIcon } from '~/server/models';
import { isContainAnimation } from '@icon/utils';

const props = defineProps<{
  icon: Omit<IIcon, 'project' | 'id'>;
  font?: string;
  component?: string;
  filter?: string;
  editable?: boolean;
}>();
type InnerIcon = IIcon & { colorful: boolean; component: string; animate: boolean };

const emit = defineEmits(['update:icon', 'delete']);

const processedIcon = computed({
  get: () =>
    ({
      ...props.icon,
      colorful: props.icon.svg.includes('fill='),
      component: `${props.component}-${props.font}-${props.icon.class}`
        .replace('--', '-')
        .replace(/^-/, ''),
      animate: isContainAnimation(props.icon.svg),
    } as Required<InnerIcon>),
  set: (value) => emit('update:icon', value),
});

const validate = computed(() => /^[a-z]+(-[a-z]+)*$/.test(processedIcon.value.class));

const handleIconClick = (icon: InnerIcon) => {
  const { copy, isSupported } = useClipboard({ source: icon.component });
  isSupported.value && copy();
};

const visible = computed<boolean>(() =>
  !!props.filter
    ? processedIcon.value.name.includes(props.filter) ||
      processedIcon.value.class.includes(props.filter)
    : true
);

const handleDecolorize = () =>
  emit('update:icon', {
    ...props.icon,
    svg: decolorize(props.icon.svg),
  });

const handleDownload = () => useDownload(`${props.icon.class}.svg`, props.icon.svg);

defineExpose({ validate })
</script>

<template>
  <li
    class="soft--box icon-container"
    :class="{
      colorful: processedIcon.colorful,
      animation: processedIcon.animate,
      invalidate: !validate,
    }"
    @click="handleIconClick(processedIcon)"
    v-show="visible"
  >
    <slot></slot>
    <span v-html="processedIcon.svg" class="svg-container"></span>
    <div class="description">
      <div :title="processedIcon.name" data-name="name">
        {{ processedIcon.name }}
      </div>
      <div :title="processedIcon.component" data-name="component">
        {{ processedIcon.component }}
      </div>
    </div>
    <div class="operation" v-if="props.editable" @click.stop>
      <i class="soft--icon" title="下载图标" @click="handleDownload">
        <IconDownload></IconDownload>
      </i>
      <ModalEdit v-model:icon="processedIcon"></ModalEdit>
      <ModalDecolorize @decolorize="handleDecolorize"></ModalDecolorize>
      <ModalDelete title="删除图标" @delete="emit('delete')"></ModalDelete>
    </div>
  </li>
</template>

<style lang="less" scoped>
.icon-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 20px;
  padding: 20px 5px 15px;
  max-width: calc(16.666666666% - 12.5px);
  min-width: calc(16.666666666% - 12.5px);
  min-height: 140px;
  justify-content: space-evenly;
  position: relative;
  user-select: none;
  cursor: pointer;
  overflow: visible;
  &.colorful::after,
  &.animation::before {
    content: '';
    position: absolute;
    right: 0;
    width: 20px;
    height: 10px;
    z-index: 1;
  }
  &.colorful::after {
    top: 0;
    width: 20px;
    height: 10px;
    background-image: linear-gradient(135deg, #a0fe65 10%, #fa016d 100%);
    border-radius: 0 var(--radius) 0 100%;
  }
  &.animation::before {
    bottom: 0;
    border-bottom-right-radius: var(--radius);
    border-right: 2px solid var(--theme-text-active);
    border-bottom: 2px solid var(--theme-text-active);
  }
  &.invalidate,
  &.invalidate:hover {
    color: var(--theme-warning);
  }
  &:hover {
    color: var(--theme-text-active);
    .svg-container {
      transform: scale(1.25);
    }
    .operation {
      visibility: visible;
    }
  }
  .svg-container {
    font-size: var(--display-size, 36px);
    transition: all ease 0.3s;
    fill: currentColor;
    :deep(svg) {
      width: 1em;
      height: 1em;
    }
  }
  .description {
    font-size: 12px;
    margin-top: 5px;
    max-width: 100%;
    text-align: center;
    div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .operation {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 8px;
    padding-left: 50px;
    font-size: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: var(--theme-text-primary);
    background: linear-gradient(to right, transparent, var(--theme-bg-primary) 50%);
    visibility: hidden;
  }
}
</style>
