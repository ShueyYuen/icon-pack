import { Project, Log, Icon, Versioned } from '~/server/models';

export default defineEventHandler(async ({ context }) => {
  const { params } = context;
  const pid = params!.pid;
  const result = await Project.deleteOne({ _id: pid });
  await Icon.deleteMany({ project: pid });
  await Log.deleteMany({ project: pid });
  await Versioned.deleteMany({ 'project._id': pid });

  return { code: 0, data: result };
});
