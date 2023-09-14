<template>
  <main class="main">
    <slot></slot>
  </main>
</template>

<style lang="less">
.main {
  flex: 1 1 auto;
  padding:80px 20px 80px;
  overflow: overlay;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  background: var(--theme-bg-primary);
  &::-webkit-scrollbar-button {
    height: 30px;
    background: transparent;
  }
  & > * {
    width: 100%;
    max-width: 900px;
  }
}
</style>
