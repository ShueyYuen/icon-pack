<template>
  <div class="no-data">
    <i class="soft--icon"> <IconBlank></IconBlank></i>
    <div>no data</div>
  </div>
</template>

<style lang="less" scoped>
.no-data {
  text-align: center;
  line-height: 40px;
  opacity: 0.6;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .soft--icon {
    height: fit-content;
    position: relative;
    display: inline;
    pointer-events: none;
    font-size: 120px;
  }
  div {
    font-size: 24px;
  }
}
</style>
