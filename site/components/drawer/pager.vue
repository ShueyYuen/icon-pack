<script setup lang="ts">
import { isNumber } from 'lodash-unified';

const props = defineProps<{
  total: number;
  modelValue: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'update:pageSize', value: number): void;
}>();

const totalPage = computed(() => Math.ceil(props.total / props.pageSize));
const PERFECT_SIZE = 9;

type PageList = (number | 'ellipsis')[];

const replaceAccidentEllipsis = (list: PageList): PageList =>
  list.map((item, i) => {
    if (item === 'ellipsis') {
      const leftNumber = list[i - 1] as number;
      const rightNumber = list[i + 1] as number;
      return leftNumber + 2 === rightNumber ? leftNumber + 1 : item;
    };
    return item;
  });

const mergePageList = (start: number[], center: number[], end: number[]): PageList => {
  const result = [1] as PageList;
  const merge = (item: number) => {
    if (result.includes(item)) {
      return;
    }
    if (!result.includes(item - 1)) {
      result.push('ellipsis');
    }
    result.push(item);
  };
  start.forEach(merge);
  center.forEach(merge);
  end.forEach(merge);
  if (result.length < totalPage.value && result.length < PERFECT_SIZE) {
    const ellipsisIndex = result.findIndex((item) => item === 'ellipsis');
    if (result.length === PERFECT_SIZE - 1) {
      if (ellipsisIndex < PERFECT_SIZE / 2) {
        const leftNumber = result[ellipsisIndex - 1] as number;
        result.splice(ellipsisIndex, 0, leftNumber + 1);
      } else {
        const rightNumber = result[ellipsisIndex + 1] as number;
        result.splice(ellipsisIndex + 1, 0, rightNumber - 1);
      }
    } else {
      const leftNumber = result[ellipsisIndex - 1] as number;
      const rightNumber = result[ellipsisIndex + 1] as number;
      const centerNumber = Math.ceil((leftNumber + rightNumber) / 2);
      if (ellipsisIndex < PERFECT_SIZE / 2) {
        result.splice(ellipsisIndex, 0, 'ellipsis', centerNumber);
      } else {
        result.splice(ellipsisIndex + 1, 0, centerNumber, 'ellipsis');
      }
      console.log('length', leftNumber, rightNumber);
    }
  }
  return replaceAccidentEllipsis(result);
};

const isValid = (i: number) => i > 0 && i <= totalPage.value;

const displayPage = computed(() => {
  if (totalPage.value <= PERFECT_SIZE) {
    return Array.from({ length: totalPage.value }, (_, i) => i + 1);
  }
  const current = props.modelValue;
  const start = [1, 2].filter(isValid);
  const end = [totalPage.value - 1, totalPage.value].filter(isValid);
  const center = Math.floor(totalPage.value / 2);
  const middle = [center - 1, center, center + 1].filter(isValid);
  return start.includes(current) || end.includes(current) || middle.includes(current)
    ? mergePageList(start, middle, end)
    : mergePageList(start, [current - 1, current, current + 1], end);
});
</script>

<template>
  <div class="navigator" v-if="totalPage > 1">
    <span
      class="soft--box soft--icon page-item"
      :class="{ disabled: modelValue <= 1 }"
      @click="emit('update:modelValue', modelValue - 1)"
    >
      <IconReturn></IconReturn>
    </span>
    <div class="pager">
      <div
        v-for="(item, i) in displayPage"
        :key="`${item}${i}`"
        class="soft--box soft--icon page-item"
        :class="{ active: modelValue === item, disabled: item === 'ellipsis' }"
        @click="isNumber(item) && emit('update:modelValue', item)"
      >
        {{ item !== 'ellipsis' ? item : '...' }}
      </div>
    </div>
    <span
      class="soft--box soft--icon page-item"
      :class="{ disabled: totalPage <= modelValue }"
      @click="emit('update:modelValue', modelValue + 1)"
    >
      <IconReturn style="transform: rotate(180deg)"></IconReturn>
    </span>
  </div>
</template>

<style lang="less" scoped>
.navigator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  font-size: 14px;
  padding-top: 5px;
  user-select: none;
  column-gap: 10px;
  .pager {
    display: flex;
    column-gap: 10px;
  }
  .page-item {
    width: 24px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    font-size: 16px;
    text-align: center;
    color: var(--theme-text-primary);
    display: inline-block;
    flex-shrink: 0;
    &.active {
      color: var(--theme-text-active);
    }
    &.disabled {
      pointer-events: none;
      opacity: 0.6;
    }
    &.soft--icon {
      border-radius: var(--radius);
      svg {
        margin: 4px;
      }
    }
  }
}
</style>
