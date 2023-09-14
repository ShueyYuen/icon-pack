import { User, Project } from '~/server/models';

export default defineEventHandler(async (event) => {
  const { params } = event.context;
  const uid = params!.uid;
  // 同时从参与的项目中移除用户
  await Project.updateMany(
    {
      users: { $elemMatch: { id: uid } },
    },
    {
      $pull: { users: { id: uid } },
    }
  );
  const user = await User.findByIdAndDelete(uid);
  if (!user) throw new Error('User not found');

  return {
    code: 0,
    data: true,
  };
});
