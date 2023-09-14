<script setup lang="ts">
import { IProject } from "~/server/models";
import { ProjectRole } from "../../constant";

defineProps<{
  title: string;
  role: ProjectRole;
  list: Array<Pick<IProject, 'id' | 'name' | 'description'>>;
}>();
</script>

<template>
  <template v-if="list.length">
    <h2 class="list-title">{{ title }}</h2>
    <div class="project-list">
      <ProjectCard v-for="project in list" :project="project" :role="role">
        {{ project }}
      </ProjectCard>
    </div>
  </template>
</template>

<style lang="less">
.list-title {
  margin-top: 20px;
  &:first-child {
    margin-top: 0;
  }
}
</style>
