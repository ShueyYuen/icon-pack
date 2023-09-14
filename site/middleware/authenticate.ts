import type { RouteLocationNormalized } from ".nuxt/vue-router";
export default defineNuxtRouteMiddleware(function (
  to: RouteLocationNormalized
) {
  const authStore = useAuthStore();
  if (!authStore.auth) {
    return navigateTo(`/login?from=${encodeURIComponent(to.fullPath)}`, {
      replace: true,
    });
  }
});
