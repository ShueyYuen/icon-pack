import { useSession } from "~/server/utils/session";
export default defineNuxtPlugin(async (nuxtApp) => {
  const event = useRequestEvent();
  const session = await useSession(event as any);
  const authStore = useAuthStore();
  authStore.user = session.user;
});
