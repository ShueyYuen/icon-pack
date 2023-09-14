<script setup lang="ts">
const username = ref('');
const password = ref('');
const handleLogin = async () => {
  const authStore = useAuthStore();
  await authStore.login({
    username: username.value,
    password: password.value,
  });
  if (authStore.auth) {
    const route = useRoute();
    return navigateTo(
      authStore.isAdmin ? '/admin' : decodeURIComponent((route.query.from || '%2F') as string),
      {
        replace: true,
      }
    );
  } else {
    useMessage({
      type: MessageType.ERROR,
      content: '登录失败，可能账号或密码错误.',
    });
  }
};
</script>

<template>
  <NuxtLayout name="copyleft">
    <form class="soft--form soft--box login">
      <div class="title">
        <h1>😃 Icon Generate 😪</h1>
      </div>
      <div class="form-item">
        <label for="username">用户名</label>
        <input
          type="text"
          name="username"
          class="soft--box soft--input"
          autocomplete="username"
          v-model="username"
        />
      </div>
      <div class="form-item">
        <label for="password">密码</label>
        <input
          type="password"
          name="password"
          class="soft--box soft--input"
          v-model="password"
          autocomplete="current-password"
        />
      </div>
      <div class="form-item submit">
        <button class="soft--box soft--button" @click.prevent="handleLogin">登录</button>
      </div>
    </form>
  </NuxtLayout>
</template>

<style lang="less" scoped>
.login {
  max-width: 240px;
}
</style>
