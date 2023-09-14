import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { User } from '~/server/models';
import { genPassword } from '~/utils';
import { SECRET_KEY } from '~/constant';
import { pick } from 'lodash-unified';

// 注册使用的账号和密码分别为 nid和@1234567
// 如果用户没有注册则自动注册
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const password = genPassword(body.password);
  const userPick = ['id', 'avatar', 'nickname', 'nid'];
  const user = await User.findOne({ nid: body.username, password }, userPick.join(' '));
  if (!user) {
    return {
      code: 0,
      data: null,
    };
  }
  const token = uuid();
  const expiresIn = 60 * 60 * 24 * 7;
  setCookie(event, 'icon-token', token, {
    maxAge: expiresIn,
    sameSite: 'none',
  });
  const content = pick(user, userPick);
  // session存储信息
  const session = await useSession(event);
  session.user = content;
  await session.save();
  // redis存储
  const data = jwt.sign(content, SECRET_KEY, {
    expiresIn,
  });
  await useStorage().setItem(`redis:token:${token}`, data, {
    ttl: expiresIn,
  });
  return {
    code: 0,
    data: pick(user, userPick),
  };
});
