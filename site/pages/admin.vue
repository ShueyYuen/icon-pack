<script setup lang="ts">
import { IUser } from '~/server/models';

definePageMeta({
  middleware: [
    'authenticate',
    () => {
      const authStore = useAuthStore();
      if (!authStore.isAdmin) {
        return navigateTo(`/`, {
          replace: true,
        });
      }
    },
  ],
});

const { data: response } = (await useLazyFetch(`/api/v1/admin/user`, { method: 'GET' })) as {
  data: Ref<{ code: number; data: Array<IUser> }>;
};

const searchKey = ref('');

const filterUsers = computed(() =>
  (response.value.data ?? []).filter(
    (item) => item.nickname.includes(searchKey.value) || item.nid.includes(searchKey.value)
  )
);

const patch = ({ id, nid }: { id: string; nid: string }) => {
  if (!response.value.data) {
    return;
  }
  const user = response.value.data.find((item) => item.id === id);
  if (user) {
    user.nid = nid;
  }
};

const deleteHandle = async ({ id }: { id: string }) => {
  const { data: res } = (await useFetch(`/api/v1/user/${id}`, {
    method: 'DELETE',
  })) as {
    data: Ref<{ code: number; data: boolean }>;
    };
  if (res.value.code === 0) {
    useMessage({
      type: MessageType.SUCCESS,
      content: '删除用户成功',
    });
    response.value.data = response.value.data.filter((item) => item.id !== id);
  }
};
</script>

<template>
  <NuxtLayout>
    <template #header>
      <span>全部用户</span>
      <ModalMe></ModalMe>
    </template>
    <div class="soft--box soft--search-box">
      <i class="soft--icon"><IconSearch></IconSearch></i>
      <input v-model="searchKey" required />
    </div>
    <ul class="user-list">
      <li v-for="user in filterUsers" :key="user.nid" class="soft--box user-card">
        <Avatar v-if="user.avatar" :id="`${user.avatar}`"></Avatar>
        <div class="nickname">{{ user.nickname }}</div>
        <div class="nid">{{ user.nid }}</div>
        <div class="operation">
          <ModalDelete title="删除用户" @delete="deleteHandle(user)"></ModalDelete>
          <ModalAdminEdit :user="user" @patch="patch"></ModalAdminEdit>
        </div>
      </li>
    </ul>
  </NuxtLayout>
</template>

<style lang="less" scoped>
.user-list {
  li {
    padding: 5px 10px;
  }
  .operation {
    display: flex;
    column-gap: 10px;
    font-size: 20px;
    flex-grow: 1;
    justify-content: flex-end;
    .error {
      color: var(--theme-error);
    }
  }
}
.soft--search-box {
  position: sticky;
  top: 0;
  margin-bottom: 10px;
}
</style>
