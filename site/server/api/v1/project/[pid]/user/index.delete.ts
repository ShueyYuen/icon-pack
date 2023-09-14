import { Project, User, LogType, SubLogType } from '~/server/models';

export default defineEventHandler(async (event) => {
  const { params } = event.context;
  const { user } = (await readBody(event)) as {
    user: string;
  };

  const userDoc = await User.findById(user);

  const res = await Project.updateOne(
    { _id: params!.pid },
    {
      $pull: {
        users: { id: user },
      },
    }
  );
  if (!res.acknowledged || !userDoc) {
    return { code: -1, message: '删除失败' };
  }

  await useLog(event, {
    type: LogType.PERMISSION,
    subType: SubLogType.DELETE,
    content: {
      name: userDoc.nickname,
    },
  });

  return { code: 0, data: true };
});
