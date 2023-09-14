<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { ProjectRole } from '~/constant';

const props = defineProps<{ role: ProjectRole }>();
const emit = defineEmits(['update:role']);

const project = useProjectStore();

const baseRoles = [
  { label: '超级管理员', value: ProjectRole.OWNER },
  { label: '管理员', value: ProjectRole.ADMIN },
  { label: '普通成员', value: ProjectRole.MEMBER },
  { label: '只读用户', value: ProjectRole.READONLY },
];

const roles = computed(() => baseRoles.filter((item) => item.value > project.role));

const display = computed(() => baseRoles.find((item) => item.value === props.role)?.label);

const target = ref(null);
const state = ref(false);

onClickOutside(target, (event) => (state.value = false));
</script>

<template>
  <div class="role">
    <span class="selector">
      <i @click="() => (state = !state)" ref="target">{{ display }}</i>
      <ul
        class="soft--box candidate"
        :class="{ visible: state }"
        v-if="props.role !== 0 && project.role < ProjectRole.MEMBER"
      >
        <li
          v-for="role in roles"
          :data="role.value"
          :class="{ active: props.role === role.value }"
          @click="emit('update:role', role.value)"
        >
          {{ role.label }}
        </li>
      </ul>
    </span>
  </div>
</template>

<style lang="less" scoped>
.role {
  flex-grow: 1;
  .selector {
    display: inline-block;
    padding: 10px;
    width: 150px;
    cursor: pointer;
    position: relative;
  }
  .candidate {
    box-sizing: border-box;
    position: absolute;
    background: var(--theme-bg-primary);
    padding: 10px;
    width: 100%;
    top: 100%;
    display: none;
    z-index: 1;
    &.visible {
      display: block;
    }
    li {
      padding: 5px 0;
      text-align: left;
      transition: all 0.3s;
      &:hover {
        color: var(--theme-text-active);
        opacity: 0.6;
      }
      &.active {
        color: var(--theme-text-active);
      }
    }
  }
}
</style>
