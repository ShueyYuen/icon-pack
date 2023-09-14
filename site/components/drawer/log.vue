<script setup lang="ts">
import { LogCardData } from '../logs/types';

const visible = ref(false);
const toggleVisible = () => (visible.value = !visible.value);

const project = useProjectStore();
const selected = ref('icon');

const logs = ref<LogCardData[]>();

const total = ref(0);
const limit = ref(10);
const page = ref(1);
watch(
  () => [selected.value, visible.value, page.value],
  async ([type, visible, page]) => {
    if (!visible) {
      return;
    }
    const { data: response } = (await useLazyFetch(
      `/api/v1/project/${project.id}/log/${type}?limit=${limit.value}&page=${(page as number) - 1}`,
      {
        method: 'GET',
      }
    )) as { data: Ref<{ code: number; data: LogCardData[]; count: number }> };
    logs.value = [];
    if (response.value?.data) {
      total.value = response.value.count;
      logs.value = response.value.data;
    }
  },
  { flush: 'post' }
);

watch(
  selected,
  () => {
    total.value = 0;
    page.value = 1;
  },
  { flush: 'pre' }
);
</script>

<template>
  <i class="soft--icon" title="查看日志" @click="toggleVisible">
    <IconLog></IconLog>
  </i>
  <Drawer v-model:visible="visible">
    <div class="soft--box soft--tabs">
      <input type="radio" id="icon" name="tabs" value="icon" v-model="selected" />
      <label class="tab" for="icon">图标</label>
      <input type="radio" id="permission" name="tabs" value="permission" v-model="selected" />
      <label class="tab" for="permission">权限</label>
      <input type="radio" id="project" name="tabs" value="project" v-model="selected" />
      <label class="tab" for="project">项目</label>
      <span class="glider"></span>
    </div>
    <template v-if="logs?.length">
      <ul class="log-area">
        <LogsTimeCard v-for="log in logs" :log="log"></LogsTimeCard>
      </ul>
      <DrawerPager :total="total" :page-size="limit" v-model="page"></DrawerPager>
    </template>
    <NoData v-else></NoData>
  </Drawer>
</template>

<style lang="less">
.drawer-container {
  max-width: 350px;
  .log-area {
    flex-grow: 1;
    overflow: auto;
    padding: 10px;
  }
}
</style>
