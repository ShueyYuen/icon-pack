<script setup lang="ts">
import { pick } from 'lodash-unified';
import { ProjectRole } from '~/constant';
import { EditableProject, IProject, editableProjectKey } from '~/server/models';

definePageMeta({
  middleware: ['authenticate'],
});

type Project = Pick<IProject, 'id' | 'name' | 'description'> & {
  role: ProjectRole;
};

const { pending, data } = useLazyFetch(`/api/v1/project`, { method: 'GET', server: false }) as {
  pending: Ref<boolean>;
  data: Ref<{ code: number; data: Array<Project> }>;
};

type ProjectMap = Record<ProjectRole, Array<Project>>;

const classifiedProjects = computed<ProjectMap>(() =>
  (pending.value ? [] : data.value.data).reduce(
    (pre, current) => {
      pre[current.role].push(current);
      return pre;
    },
    {
      [ProjectRole.OWNER]: [],
      [ProjectRole.ADMIN]: [],
      [ProjectRole.MEMBER]: [],
      [ProjectRole.READONLY]: [],
    } as unknown as ProjectMap
  )
);

const handleCreateProject = async (project: EditableProject) => {
  const { data: response } = (await useLazyFetch(`/api/v1/project`, {
    method: 'PUT',
    body: JSON.stringify(pick(project, editableProjectKey)),
  })) as {
    data: Ref<{ code: number; data: Project }>;
  };
  data.value?.data.push({ ...response.value.data, role: ProjectRole.OWNER });
};
</script>

<template>
  <NuxtLayout>
    <template #header>
      <span>全部项目</span>
      <span class="operation">
        <ModalCreate create @patch:project="handleCreateProject"></ModalCreate>
        <ModalMe></ModalMe>
      </span>
    </template>
    <LoadingLoader :loading="pending">
      <template v-if="data.data.length">
        <ProjectList
          title="我的项目"
          :list="classifiedProjects[ProjectRole.OWNER]"
          :role="ProjectRole.OWNER"
        ></ProjectList>
        <ProjectList
          title="管理的项目"
          :list="classifiedProjects[ProjectRole.ADMIN]"
          :role="ProjectRole.ADMIN"
        ></ProjectList>
        <ProjectList
          title="参与的项目"
          :list="classifiedProjects[ProjectRole.MEMBER]"
          :role="ProjectRole.READONLY"
        ></ProjectList>
        <ProjectList
          title="只读项目"
          :list="classifiedProjects[ProjectRole.READONLY]"
          :role="ProjectRole.READONLY"
        ></ProjectList>
      </template>
      <NoData v-else></NoData>
    </LoadingLoader>
  </NuxtLayout>
  <PluginDetect></PluginDetect>
</template>

<style lang="less" scoped>
.operation {
  display: flex;
  column-gap: 10px;
  font-size: 24px;
}
</style>
