import { pick } from 'lodash-unified';
import { getFingerPrint } from '@icon/utils';
import { User, Avatar } from '~/server/models';

type UserPatch = {
  avatar?: string;
  nickname?: string;
  oldPassword?: string;
  newPassword?: string;
};

export default defineEventHandler(async (event) => {
  const patch = (await readBody(event)) as UserPatch;
  const session = await useSession(event);
  const uid = session.user.id;
  const user = await User.findById(uid);
  if (!user) throw new Error('User not found');
  const { avatar, nickname, oldPassword, newPassword } = patch;

  if (nickname) {
    user.nickname = nickname;
    session.user.nickname = nickname;
  }
  if (avatar) {
    const fingerprint = getFingerPrint(avatar);
    const avatarDoc = await Avatar.findOneAndUpdate(
      { fingerprint },
      {
        fingerprint,
        src: avatar,
      },
      { upsert: true, new: true }
    );
    user.avatar = avatarDoc.id;
    session.user.avatar = avatarDoc.id;
  }
  if (nickname || avatar) {
    await session.save();
  }
  if (oldPassword && newPassword) {
    if (genPassword(oldPassword) !== user.password) {
      return {
        code: 2,
        data: null,
        message: 'Old password is incorrect',
      };
    }
    user.password = genPassword(newPassword);
  }

  await user.save();

  return {
    code: 0,
    data: pick(user, ['id', 'avatar', 'nickname', 'nid']),
    message: 'Success',
  };
});
