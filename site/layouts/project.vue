<script setup lang="ts">
const route = useRoute();
const project = useProjectStore();

const navigatorPosition = computed(() =>
  route.name === 'pid-detail' ? '/' : `/${project.id}/detail`
);
</script>

<template>
  <LayoutHeader>
    <ClientOnly>
      <NuxtLink class="soft--link home-link" :to="navigatorPosition">
        <i class="soft--icon">
          <IconReturn></IconReturn>
        </i>
        <slot name="header">
          <div class="double-line">
            <span>{{ project.name }}</span>
            <div class="information">
              Des: <b>{{ project.description || 'No Description.' }}</b>
            </div>
          </div>
        </slot>
      </NuxtLink>
      <slot name="operation"></slot>
    </ClientOnly>
  </LayoutHeader>
  <LayoutMain>
    <slot></slot>
  </LayoutMain>
  <LayoutFooter></LayoutFooter>
</template>

<style lang="less" scoped>
.home-link {
  display: flex;
  align-items: center;
  color: white;
}
.double-line {
  flex-grow: 1;
  padding: 0 20px;
  font-size: 20px;
  font-weight: 600;
}
.information {
  font-size: 12px;
  color: var(--theme-text-light);
  margin-top: 10px;
  font-weight: 100;
}
</style>
