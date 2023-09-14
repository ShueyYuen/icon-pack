import { isArray } from "lodash-unified";

export default defineNuxtPlugin(async (nuxtApp) => {
  const router = useRouter();
  const projectStore = useProjectStore();
  router.beforeEach((to) => projectStore.setId(to.params.pid as string));
  watch(
    () => projectStore.id,
    (value) => {
      if (!value || isArray(value)) {
        return;
      }
      projectStore.init();
    },
    { immediate: true, flush: "sync" }
  );
});
