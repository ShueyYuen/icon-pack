import { User } from '@icon/schema';
import { pick } from 'lodash-unified';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const reg = new RegExp(body.key, 'i');
  switch (body.type) {
    case 'user':
      const users = await User.find(
        {
          $or: [{ nid: { $regex: reg } }, { nickname: { $regex: reg } }],
        },
        '-password -__v',
        { limit: 10 }
      );
      return {
        code: 0,
        data: users
          .filter((item) => item.nid !== 'admin')
          .map((user) => pick(user, ['nid', 'nickname', 'avatar', 'id'])),
      };
    default:
      return { code: 101, message: 'unsupported type!' };
  }
});
