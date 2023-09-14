import { ProjectRole } from '~/constant';
import { Project, LogType, SubLogType, User } from '~/server/models';

export default defineEventHandler(async (event) => {
  const { params } = event.context;
  const { user } = (await readBody(event)) as {
    user: string;
  };
  const project = await Project.findById(params!.pid);
  const userDoc = await User.findById(user);

  if (!project || !userDoc) {
    return sendNoContent(event, 404);
  }

  const alreadyInProject = !!project.users.find((item) => item.id.toString() === user);
  if (!alreadyInProject) {
    await Project.updateOne(
      { _id: params!.pid },
      {
        $push: {
          users: {
            id: user,
            role: ProjectRole.READONLY,
          },
        },
      }
    );
    await useLog(event, {
      type: LogType.PERMISSION,
      subType: SubLogType.CREATE,
      content: {
        name: userDoc.nickname,
        role: String(ProjectRole.READONLY),
      },
    });
    return { code: 0, data: true };
  }
  return { code: 0, data: false };
});
