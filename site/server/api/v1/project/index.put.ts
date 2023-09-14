import { useLog } from '~/server/utils/log';
import { IProject, Project, ProjectRole, LogType, SubLogType } from '~/server/models';

export default defineEventHandler(async (event) => {
  const session = await useSession(event);
  if (!session || !session.user) return sendNoContent(event, 403);
  const project = (await readBody(event)) as IProject;
  const projectDoc = new Project(project);
  await projectDoc.save();
  await Project.updateOne(
    { _id: projectDoc.id },
    {
      $push: {
        users: {
          id: session.user.id,
          role: ProjectRole.OWNER,
        },
      },
    },
    { new: true }
  );
  await useLog(event, {
    project: projectDoc.id,
    type: LogType.PROJECT,
    subType: SubLogType.CREATE,
  });
  const projectDo = await Project.findOne({ _id: projectDoc.id });
  return { code: 0, data: projectDo };
});
