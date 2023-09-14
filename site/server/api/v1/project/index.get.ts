import { pick } from 'lodash-unified';
import { Project, ProjectRole, User, Versioned } from '~/server/models';

export default defineEventHandler(async (event) => {
  const session = await useSession(event);
  const id = session.user.id;
  if (!id) {
    return { code: 1, message: '用户未登录' };
  }
  const pickKey = ['id', 'description', 'name', 'users'];
  const projects = await Project.find(
    {
      users: { $elemMatch: { id } },
    },
    pickKey
  );
  return {
    code: 0,
    data: projects.map((project) => {
      const user = project.users.find((user) => user.id.toString() === id);
      return {
        ...pick(project, pickKey.slice(0, 3)),
        role: user ? user.role : ProjectRole.READONLY,
      };
    }),
  };
});
