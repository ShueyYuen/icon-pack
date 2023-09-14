import { User } from '~/server/models';

export default defineEventHandler(async (event) => {
  const { params } = event.context;
  const uid = params!.uid;

  const user = await User.findById(uid);
  if (!user) throw new Error('User not found');

  const patch = (await readBody(event)) as { nid: string };
  user.nid = patch.nid;
  await user.save();

  return {
    code: 0,
    data: uid,
  };
});
