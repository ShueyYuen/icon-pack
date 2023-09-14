<script setup lang="ts">
import { IUser } from '@icon/schema';

const props = defineProps<{
  user: IUser;
}>();
const emit = defineEmits<{
  (e: 'patch', data: { id: string, nid: string }): void;
}>();

const visible = ref(false);
const toggleVisible = () => (visible.value = !visible.value);

const user = ref<IUser>();

const handlePatchInfo = async () => {
  if (!user.value) {
    return toggleVisible();
  }
  const { data: res } = (await useFetch(`/api/v1/user/${user.value.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      nid: user.value.nid,
    }),
  })) as {
    data: Ref<{ code: number }>;
    };
  if (res.value.code === 0) {
    emit('patch', { id: user.value.id, nid: user.value.nid });
    useMessage({
      type: MessageType.SUCCESS,
      content: '用户信息更新成功',
    });
    toggleVisible();
  }
};

onMounted(() => (user.value = { ...props.user }));
</script>

<template>
  <i class="soft--icon" title="编辑用户ID" @click="toggleVisible">
    <IconEdit></IconEdit>
  </i>
  <Modal v-model:visible="visible">
    <div class="soft--form">
      <div class="title">用户信息</div>
      <div class="form-item avatar-line">
        <Avatar v-if="user.avatar" :id="`${user.avatar}`"></Avatar>
      </div>
      <div class="form-item">
        <label for="nickname">昵称</label>
        <input
          type="text"
          name="nickname"
          class="soft--box soft--input"
          v-model="user.nickname"
          readonly
          placeholder="请输入昵称"
          autocomplete="off"
        />
      </div>
      <div class="form-item">
        <label for="id">用户名</label>
        <input
          type="text"
          name="id"
          class="soft--box soft--input"
          v-model="user.nid"
          autocomplete="off"
          required
          placeholder="更改用户登录名称"
        />
      </div>
      <div class="form-item submit">
        <button class="soft--box soft--button" @click="handlePatchInfo">确认</button>
      </div>
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.soft--form {
  font-size: 16px;
  padding: 10px;
  .title {
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
  .form-item label {
    width: 65px;
  }
  .avatar-line {
    justify-content: center;
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50px;
    }
  }
}
</style>
