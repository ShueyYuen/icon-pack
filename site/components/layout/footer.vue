<script setup>
import { useLocalStorage, usePreferredColorScheme  } from '@vueuse/core';

const preferredColor = usePreferredColorScheme()
const theme = useLocalStorage('theme', 'auto');

watch(
  theme,
  (val) => {
    if (!globalThis.document) {
      return;
    }
    if (val === 'auto') {
      return document.documentElement.setAttribute('class', '');
    }
    document.documentElement.setAttribute('class', val);
  },
  { immediate: true }
);

const handleThemeClick = (e) => {
  const selectedTheme = e.target.getAttribute('id');
  selectedTheme && (theme.value = selectedTheme);
};
</script>

<template>
  <footer class="soft--box footer">
    <div class="copyright">
      Copyleft 🄯 2023
      <a target="_blank" class="soft--link" href="https://www.shuey.fun/">LOVE AND PEACE</a>
    </div>
    <div class="theme" @click="handleThemeClick">
      <span id="light">🌞 浅色</span>
      <span id="dark">🌛 深色</span>
      <span id="auto">🤖️ 自动</span>
    </div>
  </footer>
</template>

<style lang="less">
.soft--box.footer {
  padding: 10px;
  text-align: center;
  box-sizing: border-box;
  flex-shrink: 0;
  line-height: 18px;
  background: transparent;
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 10px;
  right: 10px;
  z-index: 2;

  border-bottom: 1px solid var(--border-color);
  background-image: radial-gradient(transparent 1px, var(--theme-bg-primary) 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);

  a {
    color: var(--theme-text-primary);
    font-weight: bolder;
    font-style: italic;
  }
  .theme {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 20px;
    user-select: none;
    span {
      cursor: pointer;
    }
  }
}
</style>
