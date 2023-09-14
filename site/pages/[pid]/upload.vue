<script setup lang="ts">
import { optimizeSvg } from '@icon/utils';
import { Types } from 'mongoose';
import { IIcon } from '~/server/models';
const route = useRoute();

definePageMeta({
  middleware: ['authenticate'],
});

const project = route.params.pid as string;

const dropZone = ref<HTMLElement>();

const { click, files } = useUploadHook<IIcon>(dropZone, {
  accept: '.svg',
  multiple: true,
  fileParse: (file: File) => {
    if (file.type !== 'image/svg+xml') {
      return;
    }
    const reader = new FileReader();
    const result = new Promise((resolve) => {
      reader.addEventListener('load', (e) => {
        const svgContent = e.target?.result as string;
        const name = file.name.split('.')[0];
        resolve({
          id: '',
          name,
          project: new Types.ObjectId(project!),
          class: name,
          svg: optimizeSvg(svgContent),
        });
      });
    }) as Promise<IIcon>;
    reader.readAsText(file);
    return result;
  },
});

const handleUpload = async () => {
  if (files.value.length) {
    const { data: res } = (await useFetch(`/api/v1/project/${project}/icon`, {
      method: 'PUT',
      body: JSON.stringify({
        icons: files.value,
      }),
    })) as {
      data: Ref<{
        code: number;
        data: boolean;
      }>;
      };
    if (res.value.data) {
      files.value = [];
      useMessage({ content: '上传成功', type: MessageType.SUCCESS });
    }
  }
};

const handleDelete = (index: number) =>
  (files.value = files.value.splice(index, 1).concat(files.value.slice(index + 1)));
const updateIcon = (icon: IIcon, i: number) => (files.value[i] = icon);
</script>

<template>
  <NuxtLayout name="project">
    <template #operation>
      <span class="tip">
        <NuxtLink to="/help" target="_blank" class="soft--link">说明</NuxtLink>
      </span>
    </template>
    <div id="drop-zone" :class="{ narrow: files.length }" ref="dropZone">
      <div>将图标 SVG 文件拖拽至框内上传</div>
      <button class="soft--box soft--button" @click="click">点此上传</button>
    </div>
    <ul class="display-area">
      <IconContent
        v-for="(icon, i) in files"
        :icon="icon"
        @update:icon="updateIcon($event, i)"
        @delete="handleDelete(i)"
        font=""
        component=""
        :editable="true"
      ></IconContent>
    </ul>
    <div v-if="files.length" class="submit">
      <button class="soft--box soft--button" @click="handleUpload">提交到项目</button>
    </div>
  </NuxtLayout>
</template>

<style lang="less" scoped>
#drop-zone {
  height: 480px;
  border-radius: var(--radius);
  border: 2px dashed var(--theme-text-active);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  row-gap: 10px;
  margin-bottom: 15px;
  transition: all ease 0.3s;
  &.narrow {
    height: 100px;
  }
  &.drop {
    background: var(--theme-bg-high);
  }
  .soft--button {
    padding: 5px 10px;
  }
}
.soft--link {
  color: var(--theme-text-light);
}
.submit {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
