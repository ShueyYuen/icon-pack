<script setup lang="ts">
import { debounce } from 'lodash-unified';
import { ProjectRole } from '~/constant';
import { IUser } from '~/server/models';

definePageMeta({
  middleware: ['authenticate'],
});

type InnerUser = IUser & { id: string };

const project = useProjectStore();

const { pending, data } = useLazyFetch(`/api/v1/project/${project.id}/user`, {
  server: false,
  method: 'GET',
}) as {
  pending: Ref<boolean>;
  data: Ref<{ code: number; data: Array<InnerUser & { role: ProjectRole }> }>;
};
const userMap = computed(() =>
  (pending.value ? [] : data.value.data).reduce(
    (acc, user) => ({ ...acc, [user.id]: true }),
    Object.create(null)
  )
);

const candidates = ref<InnerUser[]>([]);
const userLoader = debounce(async (key) => {
  if (!key) {
    return (candidates.value = []);
  }
  const { data: response } = (await useFetch(`/api/v1/suggest`, {
    server: false,
    method: 'POST',
    body: JSON.stringify({ type: 'user', key }),
  })) as {
    data: Ref<{ code: number; data: Array<InnerUser> }>;
  };
  candidates.value = response.value.data;
}, 50);

const users = computed(() => (data.value.data || []).sort((a, b) => a.role - b.role));

const searchKey = ref('');
watch(searchKey, (value) => userLoader(value));

const addUser = async (user: InnerUser) => {
  const { data: response } = (await useFetch(`/api/v1/project/${project.id}/user`, {
    server: false,
    method: 'PUT',
    body: JSON.stringify({ user: user.id }),
  })) as {
    data: Ref<{ code: number; data: boolean }>;
  };
  if (response.value.data) {
    data.value.data.push({ ...user, role: ProjectRole.READONLY });
  }
  searchKey.value = '';
};

const deleteUser = async (user: InnerUser) => {
  const { data: response } = (await useFetch(`/api/v1/project/${project.id}/user`, {
    server: false,
    method: 'DELETE',
    body: JSON.stringify({ user: user.id }),
  })) as {
    data: Ref<{ code: number; data: boolean }>;
  };
  if (response.value.data) {
    data.value.data = data.value.data.filter((u) => u.id !== user.id);
  }
};

const patchUser = async (user: InnerUser, role: ProjectRole) => {
  const { data: response } = (await useFetch(`/api/v1/project/${project.id}/user`, {
    server: false,
    method: 'PATCH',
    body: JSON.stringify({ user: user.id, role }),
  })) as {
    data: Ref<{ code: number; data: boolean }>;
  };
  if (response.value.data) {
    data.value.data = data.value.data.map((u) => (u.id === user.id ? { ...user, role } : u));
  }
};
</script>

<template>
  <NuxtLayout name="project">
    <LoadingLoader :loading="pending">
      <div class="soft--box soft--search-box">
        <i class="soft--icon"><IconSearch></IconSearch></i>
        <input v-model="searchKey" required />
        <ul class="candidates" v-if="candidates.length">
          <li v-for="user in candidates" class="soft--box user-card">
            <Avatar v-if="user.avatar" :id="`${user.avatar}`"></Avatar>
            <div class="nickname">{{ user.nickname }}</div>
            <div class="nid">{{ user.nid }}</div>
            <button
              class="soft--link"
              v-if="project.isMaintainer"
              @click="addUser(user)"
              :disabled="userMap[user.id]"
            >
              {{ userMap[user.id] ? '已在项目中' : '添加至项目' }}
            </button>
          </li>
        </ul>
        <NoData v-else-if="searchKey" class="candidates"></NoData>
      </div>
      <ul class="user-list">
        <li v-for="user in users" class="soft--box user-card">
          <Avatar v-if="user.avatar" :id="`${user.avatar}`"></Avatar>
          <div class="group">
            <div class="nickname">{{ user.nickname }}</div>
            <div class="nid">{{ user.nid }}</div>
          </div>
          <MemberRole :role="user.role" @update:role="patchUser(user, $event)"></MemberRole>
          <button
            class="soft--link"
            v-if="project.role < Math.min(user.role, ProjectRole.MEMBER)"
            @click="deleteUser(user)"
          >
            删除
          </button>
        </li>
      </ul>
    </LoadingLoader>
  </NuxtLayout>
</template>

<style lang="less" scoped>
.soft--link[disabled] {
  cursor: not-allowed;
  filter: grayscale(1);
}
.soft--search-box {
  height: unset;
  background: var(--theme-bg-primary);
  width: 100%;
  z-index: 5;
  .candidates {
    width: 100%;
    .user-card {
      margin: 0 10px 10px;
      .nickname {
        padding: 0 10px;
        width: unset;
      }
      .nid {
        flex-grow: 1;
      }
    }
  }
}
.user-list {
  margin-top: 20px;
}
</style>
