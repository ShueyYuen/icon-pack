<script setup lang="ts">
import type { User } from '@/stores/auth';

const visible = ref(false);
const toggleVisible = () => (visible.value = !visible.value);

const handleLogout = async () => {
  toggleVisible();
  await authStore.logout();
  window.location.reload();
};

const authStore = useAuthStore();

const oldPassword = ref('');
const newPassword = ref('');
const nickname = ref('');

const user = computed(() => authStore.user ?? ({} as User));

const RESIZE_SIZE = 100;
const avatar = ref<HTMLDivElement>();
const { click, files } = useUploadHook<string>(avatar, {
  accept: 'image/*',
  multiple: false,
  fileParse: (file: File) => {
    const reader = new FileReader();
    const result = new Promise<string>((resolve) => {
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        const image = new Image();
        image.addEventListener('load', () => {
          const canvas = document.createElement('canvas');
          canvas.width = RESIZE_SIZE;
          canvas.height = RESIZE_SIZE;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const ctx = canvas.getContext('2d')!;
          const size = image.width > image.height ? image.height : image.width;
          ctx.drawImage(image, 0, 0, size, size, 0, 0, RESIZE_SIZE, RESIZE_SIZE);
          const base64 = canvas.toDataURL('image/jpeg');
          resolve(base64.replace(/^data:image\/\w+;base64,/, ''));
        });
        image.src = imageData;
      };
    });
    reader.readAsDataURL(file);
    return result;
  },
});

const handlePatchInfo = async () => {
  toggleVisible();
  const { data: res } = (await useFetch('/api/v1/user', {
    method: 'PATCH',
    body: JSON.stringify({
      avatar: files.value[0] || '',
      nickname: nickname.value,
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    }),
  })) as {
    data: Ref<{
      code: number;
      message: string;
      data: User;
    }>;
  };
  if (res.value.code === 0) {
    useMessage({
      type: MessageType.SUCCESS,
      content: '修改成功',
    });
    authStore.user && Object.assign(authStore.user, res.value.data);
  }
};

watch(visible, () => {
  nickname.value = user.value.nickname;
  oldPassword.value = '';
  newPassword.value = '';
  files.value.length = 0;
});
</script>

<template>
  <i class="soft--icon" title="个人信息" @click="toggleVisible">
    <IconMe></IconMe>
  </i>
  <Modal v-model:visible="visible">
    <form class="soft--form" action="/his">
      <div class="title">用户信息</div>
      <div class="form-item avatar-line" ref="avatar">
        <Avatar :id="user.avatar" :src="files[0]"></Avatar>
        <IconEdit class="soft--icon" @click="click"></IconEdit>
      </div>
      <div class="form-item">
        <label for="nickname">昵称</label>
        <input
          type="text"
          name="nickname"
          class="soft--box soft--input"
          v-model="nickname"
          required
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
          :value="user.nid"
          autocomplete="off"
          readonly
          title="ID信息请联系admin更改"
        />
      </div>
      <div class="form-item">
        <label for="old-password">旧密码</label>
        <input
          type="password"
          name="old-password"
          class="soft--box soft--input"
          v-model="oldPassword"
          autocomplete="off"
          placeholder="如需更改密码，请输入旧密码"
        />
      </div>
      <div class="form-item">
        <label for="password">新密码</label>
        <input
          type="password"
          name="password"
          class="soft--box soft--input"
          v-model="newPassword"
          autocomplete="off"
          placeholder="如需改密码，请输入新密码"
        />
      </div>
      <div class="form-item submit">
        <button class="soft--box soft--button not-prefer" @click="handleLogout" type="reset">退出登录</button>
        <button class="soft--box soft--button" @click="handlePatchInfo" type="submit">确认</button>
      </div>
    </form>
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
    position: relative;
    &.drop {

    }
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50px;
    }
    .soft--icon {
      position: absolute;
      bottom: 0;
      left: calc(50% + 20px);
      font-size: 24px;
      padding: 5px;
      color: var(--theme-text-primary);
      fill: currentColor;
      background: var(--theme-bg-high);
    }
  }
}
</style>
