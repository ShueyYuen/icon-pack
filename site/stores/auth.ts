interface LoginPayload {
  username: string;
  password: string;
}

export interface User {
  id: string;
  nid: string;
  avatar: string;
  nickname: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): { user: User | null } => ({
    user: null,
  }),

  actions: {
    async login({ username, password }: LoginPayload) {
      const { data: res } = await useFetch(`/api/v1/login`, {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const response = res.value;
      if (!response) {
        return;
      }
      this.user = response.data as any;
    },
    async logout() {
      this.user = null;
      await useFetch('/api/v1/logout', { method: 'POST' });
    },
  },

  getters: {
    auth: (state) => !!state.user,
    uid: (state) => state.user?.id,
    isAdmin: (state) => state.user?.nid === 'admin',
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
