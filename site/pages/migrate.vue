<script setup lang="ts">
import { optimizeSvg } from '@icon/utils';
import { isEqual, pick } from 'lodash-unified';
import { ProjectRole } from '~/constant';
import { IIcon, IUser, IProject, EditableProject } from '~/server/models';

definePageMeta({
  middleware: ['authenticate'],
});

type InnerIcon = Omit<IIcon, 'id'>;

type MigratePostMessageData = {
  icons: Array<InnerIcon>;
  project: IProject;
  projectRole: ProjectRole;
  users: Array<IUser>;
  avatars: Record<string, string>;
};

const pending = ref(true);
const isNewCreate = ref(true);
const validate = ref(false);
const migrated = ref(false);
const icons = ref<Array<InnerIcon>>([]);
const onlineIcons = ref<Array<InnerIcon>>([]);
const newAddedIcon = computed(() => icons.value.filter((icon) => 'new' in icon && icon.new));
const migrateDisable = computed(
  () =>
    pending.value ||
    !validate.value ||
    migrated.value ||
    (!isNewCreate.value && !newAddedIcon.value.length)
);

let data: MigratePostMessageData | null = null;

const handleIconsUpdate = (update: Array<InnerIcon>) => (icons.value = update);
const project = ref<Omit<IProject, 'users'>>({
  id: '',
  name: '',
  description: '',
  prefix: '',
  family: '',
  meta: {},
});

const handleMigrate = async () => {
  if (migrateDisable.value) {
    return;
  }
  const requestParam = isNewCreate.value
    ? data
    : {
        project: pick(data?.project, 'meta'),
        icons: newAddedIcon.value.map((icon) => pick(icon, ['class', 'meta', 'name', 'svg'])),
      };
  const { data: res } = (await useFetch(`/api/v1/project/migrate`, {
    method: 'POST',
    body: JSON.stringify(requestParam),
  })) as {
    data: Ref<{ code: number; data: boolean }>;
    };
  if (res.value.data) {
    useMessage({
      type: MessageType.SUCCESS,
      content: '迁移成功',
    });
    migrated.value = true;
  }
};

const handleProjectUpdate = (p: EditableProject) => {
  if (!isNewCreate.value) {
    return;
  }
  Object.assign(project.value, p);
};

watch(icons, (value) => data && (data.icons = value));

onMounted(() => {
  if (window.self !== window.parent) {
    window.addEventListener('message', async (e) => {
      data = e.data as MigratePostMessageData;
      data.avatars = Object.fromEntries((data.avatars as any as Map<string, string>).entries());
      project.value = data.project;
      const { data: metaResponse } = (await useFetch(`/api/v1/project/meta-filter`, {
        method: 'POST',
        body: JSON.stringify(project.value.meta),
      })) as {
        data: Ref<{
          code: number;
          message: string;
          data:
            | (Omit<IProject, 'users' | 'id'> & {
                icons: InnerIcon[];
              })
            | null;
        }>;
      };
      isNewCreate.value = metaResponse.value.data === null;
      if (metaResponse.value.data) {
        project.value = {
          ...project.value,
          ...pick(metaResponse.value.data, ['name', 'description', 'family', 'prefix']),
        };
        onlineIcons.value = metaResponse.value.data.icons;
      }

      icons.value = data.icons.map((icon) => ({
        ...icon,
        svg: optimizeSvg(icon.svg),
        new: !onlineIcons.value.find((i) => isEqual(i.meta, icon.meta)),
      }));
      pending.value = false;
    });
    window.parent?.postMessage('migrate:start', 'https://www.iconfont.cn');
  } else {
    window.close();
  }
});
</script>

<template>
  <NuxtLayout>
    <template #header>
      <div class="double-line">
        <ClientOnly>
          <span>{{ project?.name }}</span>
          <div class="information">
            Des: <b>{{ project?.description || 'No Description.' }}</b>
          </div>
        </ClientOnly>
      </div>
      <div class="operation">
        <NuxtLink to="/help" target="_blank" class="soft--link"> 图标说明 </NuxtLink>
        <ModalCreate
          :project="project"
          :readonly="!isNewCreate"
          v-model:validate="validate"
          @patch:project="handleProjectUpdate"
        ></ModalCreate>
        <i
          class="soft--icon"
          :title="isNewCreate ? '新增图标库' : '增量更新'"
          @click="handleMigrate"
          :data-disabled="migrateDisable"
          ><IconMigrate></IconMigrate
        ></i>
      </div>
    </template>
    <LoadingLoader :loading="pending">
      <IconDisplay
        :icons="icons"
        @update:icons="handleIconsUpdate"
        :font="project.family"
        :component="project.prefix"
        :editable="true"
      >
        <template #default="item">
          <div v-if="'new' in item && item.new" class="new-tag">NEW</div>
        </template>
      </IconDisplay>
    </LoadingLoader>
  </NuxtLayout>
</template>

<style lang="less" scoped>
.operation {
  display: flex;
  column-gap: 15px;
  font-size: 24px;
  .soft--link {
    color: var(--theme-text-light);
    font-size: 18px;
    line-height: 18px;
  }
}

.new-tag {
  display: inline-block;
  font-size: 12px;
  position: absolute;
  left: -8px;
  top: -8px;
  background: var(--theme-error);
  padding: 2px 5px;
  border-radius: var(--radius);
  color: #fff;
  opacity: 0.6;
  font-style: italic;
  font-weight: 600;
}

.information {
  font-size: 12px;
  color: var(--theme-text-light);
  margin-top: 10px;
  font-weight: 100;
}
</style>
