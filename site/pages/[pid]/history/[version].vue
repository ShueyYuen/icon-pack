<script setup lang="ts">
import { LATEST_VERSION } from '~/constant';
import { IIcon, IProject } from '~/server/models';

definePageMeta({
  middleware: ['authenticate'],
});
const route = useRoute();
const version = route.params.version || LATEST_VERSION;

const project = useProjectStore();

const { pending, data: response } = useLazyFetch(`/api/v1/project/${project.id}/icon/${version}`, {
  server: false,
  method: 'GET',
}) as {
  pending: Ref<boolean>;
  data: Ref<{
    code: number;
    data: {
      icons: Array<IIcon>;
      config: Pick<IProject, 'family' | 'prefix'>;
    };
  }>;
};

const isGlobal = ref(false);
</script>

<template>
  <NuxtLayout name="project">
    <template #operation>
      <label class="global-import" title="启动全局引入">
        <input type="checkbox" v-model="isGlobal" />
        <div class="checkmark"></div>
        <span class="description">全局引入</span>
        <span class="version">{{ version }}</span>
      </label>
    </template>
    <LoadingLoader :loading="pending">
      <IconDisplay
        :icons="response.data.icons"
        :font="project.family"
        :component="isGlobal ? project.prefix : ''"
        :editable="false"
      >
        <template #header>
          <CodeGlobal
            v-if="isGlobal"
            :demo="response.data.icons[0]"
            :config="response.data.config"
          ></CodeGlobal>
          <CodeSingle
            v-else
            :demo="response.data.icons[0]"
            :config="response.data.config"
          ></CodeSingle>
        </template>
      </IconDisplay>
    </LoadingLoader>
  </NuxtLayout>
</template>

<style lang="less" scoped>
.global-import {
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 20px;
  user-select: none;
  display: flex;
  align-items: center;
  column-gap: 10px;
  .description {
    font-size: 16px;
    font-weight: 300;
  }
  .version {
    font-weight: 600;
    font-style: italic;
  }
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    &:checked ~ .checkmark {
      box-shadow: inset 3px 3px 5px #226c44, inset -3px -3px 5px #44d688;
    }
  }
  .checkmark {
    position: relative;
    top: 0;
    left: 0;
    height: 1.3em;
    width: 1.3em;
    background-color: #33a166;
    border-radius: 100%;
    box-shadow: 3px 3px 5px #226c44, -3px -3px 5px #44d688;
    transition-duration: 0.5s;
    &:after {
      content: '';
      position: absolute;
      opacity: 0;
    }
  }
}
.global-import input:checked ~ .checkmark:after {
  opacity: 1;
}
.global-import .checkmark:after {
  left: 0.45em;
  top: 0.25em;
  width: 0.25em;
  height: 0.5em;
  border: solid rgb(255, 255, 255);
  border-width: 0 0.15em 0.15em 0;
  transform: rotate(45deg);
}
</style>
