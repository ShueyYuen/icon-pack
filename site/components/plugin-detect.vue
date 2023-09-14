<script setup lang="ts">
import { useStorage } from '@vueuse/core';

const pluginInstall = usePluginDetect();
const unMessageAgain = useStorage('plugin-message', true);
const pluginMessage = useStorage('pigin-show', true, process.client ? sessionStorage : undefined);
</script>

<template>
  <ClientOnly>
    <div class="soft--box plugin-install" v-if="!pluginInstall && pluginMessage && unMessageAgain">
      <div class="close" @click="pluginMessage = false" title="重启会话将再次显示"></div>
      <p>
        检测到没有安装插件，如需迁移其他平台图标请<br />
        <a href="/main.user.js" class="soft--link">点击安装插件</a>
      </p>
      <div style="text-align: right">
        <button class="soft--box soft--button" @click="unMessageAgain = false">不再提醒</button>
      </div>
    </div>
  </ClientOnly>
</template>

<style lang="less" scoped>
.plugin-install {
  position: absolute;
  left: 10px;
  bottom: 80px;
  width: 200px;
  height: 100px;
  background: var(--theme-bg-primary);
  padding: 15px 20px;
  line-height: 24px;
  overflow: visible;
  user-select: none;
  .close {
    left: unset;
    right: -20px;
  }
}
</style>
