<script setup lang="ts">
import { IProject } from "~/server/models";
import { ProjectRole } from "../../constant";

defineProps<{
  project: Pick<IProject, 'id' | 'name' | 'description'>;
  role: ProjectRole;
}>();
</script>

<template>
  <div class="soft--box project-card">
    <NuxtLink :to="`/${project.id}/detail`" class="soft--link title">
      <div>{{ project.name }}</div>
      <div class="description">
        des: {{ project.description || "No Description." }}
      </div>
    </NuxtLink>
    <span class="operation">
      <NuxtLink :to="`/${project.id}/member`">
        <i class="soft--icon" title="成员管理"><IconMember></IconMember></i>
      </NuxtLink>
      <NuxtLink :to="`/${project.id}/upload`" v-if="!(role & 2)">
        <i class="soft--icon" title="上传图标"><IconUpload></IconUpload></i>
      </NuxtLink>
      <NuxtLink :to="`/${project.id}/version`">
        <i class="soft--icon" title="历史版本"><IconHistory></IconHistory></i>
      </NuxtLink>
    </span>
  </div>
</template>

<style lang="less" scoped>
.project-card {
  padding: 10px 20px;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--theme-text-primary);
  column-gap: 10px;
  line-height: 24px;
  .title {
    flex-grow: 1;
    color: var(--theme-text-stress);
  }
  .description {
    color: var(--theme-text-primary);
    font-size: 14px;
    line-height: 22px;
  }
  .soft--icon {
    font-size: 20px;
    color: var(--theme-text-low);
    &:hover {
      color: var(--theme-text-active);
    }
  }
  .operation {
    display: flex;
    column-gap: 10px;
  }
}
</style>
