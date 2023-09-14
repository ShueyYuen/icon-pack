import { pick } from 'lodash-unified';
import { Project, User, Versioned } from '~/server/models';

export default defineEventHandler(async (event) => {
  const session = await useSession(event);
  if (session && session.user && session.user.nid === 'admin') {
    const users = await User.find();
    return {
      code: 0,
      data: users
        .filter((item) => item.nid !== 'admin')
        .map((item) => pick(item, ['id', 'nid', 'nickname', 'avatar'])),
    };
  }
  return { code: 0, data: [] };
});
