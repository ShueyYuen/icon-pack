import { EditableProject } from '~/server/models';
import { ProjectRole } from '~/constant';

interface Project {
  id: string;
  name: string;
  description: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  family: string;
  prefix: string;
  version: string;
  role: ProjectRole;
}
export const useProjectStore = defineStore('project', {
  state: (): Project => ({
    id: '',
    name: '',
    description: '',
    deletedAt: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    family: '',
    prefix: '',
    version: '0.0.0',
    role: ProjectRole.READONLY,
  }),

  getters: {
    isMaintainer: (state) => state.role < ProjectRole.MEMBER,
  },

  actions: {
    setId(id: string) {
      this.id = id;
    },
    update(p: EditableProject) {
      Object.assign(this, p);
    },
    async init() {
      if (!this.id) {
        return;
      }
      this.role = ProjectRole.READONLY;
      const { data } = (await useLazyFetch(`/api/v1/project/${this.id}`, {
        method: 'GET',
      })) as { data: Ref<{ code: number; data: Project & { _id: string } }> };
      Object.assign(this, data.value.data);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
