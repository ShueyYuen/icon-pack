<script setup lang="ts">
import IconDisplay from '@/components/icon-display.vue';
import { pick } from 'lodash-unified';
import { LATEST_VERSION } from '~/constant';
import { IIcon, EditableProject, editableProjectKey } from '~/server/models';

definePageMeta({
  middleware: ['authenticate'],
});
const route = useRoute();
const version = route.query.version || LATEST_VERSION;

const validate = ref(false);
const project = useProjectStore();

const { pending, data: icons } = useLazyFetch(`/api/v1/project/${project.id}/icon/${version}`, {
  server: false,
  method: 'GET',
}) as {
  pending: Ref<boolean>;
  data: Ref<{ code: number; data: Array<IIcon> }>;
};

const handleProjectUpdate = async (value: EditableProject) => {
  await useFetch(`/api/v1/project/${project.id}`, {
    method: 'PATCH',
    body: JSON.stringify(pick(value, editableProjectKey)),
  });
  project.update(value);
};

const handleIconPatch = async (icon: IIcon, result: Array<IIcon>) => {
  const { data } = await useFetch(`/api/v1/project/${project.id}/icon`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...pick(icon, ['class', 'name', 'svg', 'id']),
    }),
  });
  if (data.value && data.value.data) {
    icons.value.data = result;
  }
};

const handleIconDelete = async (icon: IIcon, result: Array<IIcon>) => {
  const { data } = await useFetch(`/api/v1/project/${project.id}/icon`, {
    method: 'DELETE',
    body: JSON.stringify({ id: icon.id }),
  });
  if (data.value && data.value.data) {
    icons.value.data = result;
    useMessage({ content: '删除图标成功', type: MessageType.SUCCESS });
  }
};

const handleProjectDelete = async () => {
  await useFetch(`/api/v1/project/${project.id}`, {
    method: 'DELETE',
  });
  const router = useRouter();
  router.replace('/');
  useMessage({ content: '删除项目成功', type: MessageType.SUCCESS });
};

const iconDisplay = ref<typeof IconDisplay>();
</script>

<template>
  <NuxtLayout name="project">
    <template #operation>
      <div class="operation">
        <NuxtLink :to="`/${project.id}/member`">
          <i class="soft--icon animation" title="成员管理"><IconMember></IconMember></i>
        </NuxtLink>
        <NuxtLink :to="`/${project.id}/upload`" v-if="project.isMaintainer">
          <i class="soft--icon" title="上传图标"><IconUpload></IconUpload></i>
        </NuxtLink>
        <NuxtLink :to="`/${project.id}/version`">
          <i class="soft--icon" title="历史版本"><IconHistory></IconHistory></i>
        </NuxtLink>
        <DrawerLog></DrawerLog>
        <ModalCreate
          v-if="project.isMaintainer"
          :example="icons?.data[0]"
          :project="project"
          v-model:validate="validate"
          @patch:project="handleProjectUpdate"
        ></ModalCreate>
        <ModalUpgrade v-if="project.isMaintainer" :disabled="!validate || !iconDisplay?.validate"></ModalUpgrade>
        <ModalDelete
          v-if="project.isMaintainer"
          title="删除项目"
          @delete="handleProjectDelete"
        ></ModalDelete>
      </div>
    </template>
    <LoadingLoader :loading="pending">
      <IconDisplay
        v-if="icons.data.length"
        ref="iconDisplay"
        :icons="icons.data"
        :font="project.family"
        :component="project.prefix"
        :editable="project.isMaintainer"
        @patch="handleIconPatch"
        @delete="handleIconDelete"
      ></IconDisplay>
      <NoData v-else></NoData>
    </LoadingLoader>
  </NuxtLayout>
</template>

<style lang="less" scoped>
.operation {
  display: flex;
  column-gap: 15px;
  font-size: 24px;
  :deep(.soft--icon) {
    height: 1em;
    color: var(--theme-text-light);
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
