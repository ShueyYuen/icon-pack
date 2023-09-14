import { Icon, Project, editableProjectKey } from '~/server/models';
import { pick } from 'lodash-unified';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const project = await Project.findOne({ meta: body });
  if (!project) {
    return {
      code: 0,
      data: null,
      message: '项目不存在',
    };
  }
  const icons = await Icon.find({ project: project.id });
  return {
    code: 0,
    data: {
      ...pick(project, editableProjectKey),
      icons: icons.map((icon) => pick(icon, 'id', 'name', 'svg', 'class', 'meta')),
    },
  };
});
