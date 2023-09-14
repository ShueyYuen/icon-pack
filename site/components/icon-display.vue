<script setup lang="ts">
import IconContent from './icon-content.vue';
import { IIcon } from '~/server/models';

type InnerIcon = Omit<IIcon, 'project' | 'id'>;

const props = defineProps<{
  icons: Array<InnerIcon>;
  font?: string;
  component?: string;
  editable: boolean;
}>();

const filter = ref('');

const emit = defineEmits(['update:icons', 'patch', 'delete']);

const handleIconUpdate = (icon: InnerIcon, index: number) => {
  const updated = [...props.icons];
  updated[index] = icon;
  emit('update:icons', updated);
  emit('patch', icon, updated);
};

const handleIconDelete = (icon: InnerIcon, index: number) => {
  const updated = [...props.icons];
  updated.splice(index, 1);
  emit('update:icons', updated);
  emit('delete', icon, updated);
};
const displaySize = ref(36);

const autofocus = window.self === window.parent;

const iconContents = ref<(typeof IconContent)[]>([]);
const validate = computed(() => iconContents.value.every((i) => i.validate));
defineExpose({ validate });
</script>

<template>
  <div class="operation-list">
    <div class="soft--box soft--range-slider">
      <input type="range" min="16" max="120" v-model="displaySize" class="range-slider" />
      <input type="number" min="16" max="120" v-model="displaySize" class="soft--input" />
    </div>
    <div class="soft--box soft--search-box">
      <i class="soft--icon"><IconSearch></IconSearch></i>
      <input v-model="filter" required :autofocus="autofocus" />
    </div>
  </div>
  <slot name="header"></slot>
  <ul class="display-area" :style="`--display-size: ${displaySize}px`">
    <IconContent
      v-for="(icon, index) in icons"
      ref="iconContents"
      :icon="icon"
      @update:icon="handleIconUpdate($event, index)"
      @delete="handleIconDelete(icon, index)"
      :font="props.font"
      :component="props.component"
      :editable="editable"
      :filter="filter"
    >
      <slot v-bind="icon"></slot>
    </IconContent>
  </ul>
</template>

<style lang="less" scoped>
.operation-list {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  .soft--input {
    color: var(--theme-text-primary);
    width: 50px;
    height: calc(1em + 4px);
    &:hover,
    &:focus,
    &:invalid {
      box-shadow: none;
    }
  }
}
</style>
