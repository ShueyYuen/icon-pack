import { pick } from "lodash-unified";
import { User } from '~/server/models';
import { genPassword } from '~/utils';

export default async () => {
  const admin = {
    nid: 'admin',
    nickname: '管理员',
    password: genPassword('@1234567'),
  };

  await User.findOneAndUpdate(pick(admin, ['nid']), { $setOnInsert: admin }, { upsert: true });
};
