import { pick } from 'lodash-unified';
import {
  EditableProject,
  Project,
  editableProjectKey,
  OldSuffix,
  LogType,
  SubLogType,
} from '~/server/models';

export default defineEventHandler(async (event) => {
  const { params } = event.context;
  const patch = (await readBody(event)) as EditableProject;

  const project = await Project.findByIdAndUpdate(params!.pid, pick(patch, editableProjectKey), {
    returnOriginal: true,
  });

  if (!project) {
    return sendNoContent(event, 404);
  }

  const logContent = (Object.keys(patch) as (keyof EditableProject)[]).reduce((acc, key) => {
    if (project[key] !== patch[key]) {
      acc[key] = patch[key];
      acc[`${key}__old`] = project[key];
    }
    return acc;
  }, {} as OldSuffix<Partial<EditableProject>>);
  if (Object.keys(logContent).length > 0) {
    await useLog(event, {
      type: LogType.PROJECT,
      subType: SubLogType.UPDATE,
      content: logContent,
    });
  }
  return { code: 0, data: project };
});
