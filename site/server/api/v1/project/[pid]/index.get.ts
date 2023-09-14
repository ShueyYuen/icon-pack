import { pick } from "lodash-unified";
import { Project, ProjectRole, TaskStatus, Versioned } from '~/server/models';

export default defineEventHandler(async ({ context }) => {
  const { params } = context;
  const pid = params!.pid;
  const project = await Project.findById(pid, '-_id -__v -meta');

  const uid = context.session.user.id;
  const versioned = await Versioned.find({
    'project._id': pid,
    step: {
      $ne: TaskStatus.FAILED,
    },
  })
    .sort({ date: -1 })
    .limit(1);
  const version = versioned.length > 0 ? versioned[0].version : '0.0.0';
  const role =
    project?.users.find((user) => user.id.toString() === uid)?.role ?? ProjectRole.READONLY;
  return {
    code: 0,
    data: {
      ...pick(project, [
        'createdAt',
        'deletedAt',
        'description',
        'family',
        'name',
        'prefix',
        'updateAt',
      ]),
      version,
      role,
    },
  };
});
