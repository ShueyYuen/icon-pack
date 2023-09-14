import { ProjectRole } from 'constant';
import { Project, User, LogType, SubLogType } from '~/server/models';

export default defineEventHandler(async (event) => {
  const { params } = event.context;
  const { user, role } = (await readBody(event)) as {
    user: string;
    role: ProjectRole;
  };

  const userDoc = await User.findById(user);

  const res = await Project.updateOne(
    { _id: params!.pid, 'users.id': user },
    { $set: { 'users.$.role': role } }
  );
  if (!res.acknowledged || !userDoc) {
    return { code: -1, message: '修改权限失败' };
  }

  await useLog(event, {
    type: LogType.PERMISSION,
    subType: SubLogType.UPDATE,
    content: {
      name: userDoc.nickname,
      role: String(role),
    },
  });

  return { code: 0, data: true };
});
