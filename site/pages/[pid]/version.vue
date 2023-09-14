<script setup lang="ts">
import { IVersion, TaskStatus } from '~/server/models';

definePageMeta({
  middleware: ['authenticate'],
});

const route = useRoute();
const projectId = route.params.pid;
const project = useProjectStore();

const { pending, data } = useLazyFetch(`/api/v1/project/${projectId}/version`, {
  server: false,
  method: 'GET',
}) as {
  pending: Ref<boolean>;
  data: Ref<{ code: number; data: Array<IVersion> }>;
};

const versions = computed(() => data.value.data || []);

const description = {
  [TaskStatus.COMPLETE]: { title: '查看构建结果' },
  [TaskStatus.FAILED]: { title: '构建失败，展开查看日志', class: 'error' },
  [TaskStatus.INLINE]: { title: '队列中', class: 'loading' },
  [TaskStatus.RUNNING]: { title: '构建中', class: 'loading' },
} as Record<TaskStatus, { title: string; class: string }>;
</script>

<template>
  <NuxtLayout name="project">
    <LoadingLoader :loading="pending">
      <ul v-if="versions.length">
        <li
          v-for="version in versions"
          :class="['soft--box list-item', description[version.step].class]"
          :data-time="version.date"
        >
          <details>
            <summary class="version-card">
              <div class="version">{{ version.version }}</div>
              <div class="logs">{{ version.logs }}</div>
              <div class="status">
                <NuxtLink
                  v-if="version.step === TaskStatus.COMPLETE"
                  :to="`/${project.id}/history/${version.version}`"
                  class="soft--link"
                >
                  <i class="soft--icon" :title="description[version.step].title">
                    <IconPreview></IconPreview>
                  </i>
                </NuxtLink>
                <i class="soft--icon error" :title="description[version.step].title" v-else>
                  <IconError v-if="version.step === TaskStatus.FAILED"></IconError>
                  <IconLoading v-else></IconLoading>
                </i>
              </div>
            </summary>
            <pre class="build-logs" v-if="version.build.length">
              <div v-for="log in version.build">{{ log }}</div>
            </pre>
            <NoData v-else></NoData>
          </details>
        </li>
      </ul>
      <NoData v-else></NoData>
    </LoadingLoader>
  </NuxtLayout>
</template>

<style lang="less" scoped>
/* 定义关键帧 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.list-item {
  margin-bottom: 15px;
  padding: 10px;
  position: relative;
  overflow: visible;
  &::after {
    content: attr(data-time);
    position: absolute;
    left: 10px;
    top: -8px;
    font-size: 12px;
    color: #fff;
    background-color: var(--theme-text-active);
    padding: 2px 5px;
    border-radius: 5px;
    font-weight: 600;
    letter-spacing: 1px;
    opacity: 0.5;
  }
  details[open] summary {
    position: relative;
    border-bottom: 3px dashed var(--theme-bg-active1);
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 6px;
      height: 3px;
      background: var(--theme-bg-active1);
      border-radius: 5px 5px 0 0;
      bottom: -3px;
    }
    &::before {
      left: -12px;
      transform: rotate(90deg);
    }
    &::after {
      right: -12px;
      transform: rotate(-90deg);
    }
  }
  &.loading,
  &.error {
    &::after {
      background: var(--color);
    }
    .status {
      color: var(--color);
    }
  }
  &.loading {
    --color: var(--theme-warning);
    .status .soft--icon {
      animation: spin 1s infinite linear;
    }
  }

  &.error {
    --color: var(--theme-error);
  }
}
.version-card {
  padding: 10px;
  display: flex;
  align-items: center;
  .version {
    width: 100px;
  }
  .logs {
    padding-left: 20px;
    flex-grow: 1;
  }
  .status {
    font-size: 20px;
  }
}
.build-logs {
  padding: 10px 20px;
  overflow-x: scroll;
}
</style>
