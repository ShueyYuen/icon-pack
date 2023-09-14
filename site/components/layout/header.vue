<template>
  <header class="soft--box header">
    <div class="soft--box cover"></div>
    <div class="title">
      <slot></slot>
    </div>
  </header>
</template>

<style lang="less">
.header {
  height: 60px;
  margin: 5px 10px;
  overflow: visible;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--theme-text-light);
  font-weight: bolder;
  position: absolute;
  flex-shrink: 0;
  width: calc(100% - 20px);
  z-index: 10;

  .cover {
    background-image: linear-gradient(120deg, #81fbb8 10%, #28c76f 100%);
    position: absolute;
    width: 100%;
    height: 100%;
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.3;
      background-image: linear-gradient(234deg, #394245 0%, #000 100%);
    }
  }

  .title {
    padding: 0 20px;
    z-index: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 900px;
    margin: 0 auto;
  }
  .soft--icon {
    font-size: 24px;
  }
}
</style>
