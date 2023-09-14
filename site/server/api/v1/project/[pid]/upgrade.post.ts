import { Types } from 'mongoose';
import { pick } from 'lodash-unified';
import { Icon, LogType, Project, SubLogType, TaskStatus, Versioned } from '~/server/models';

export default defineEventHandler(async (event) => {
  const { version, log } = (await readBody(event)) as {
    version: string;
    log: string;
  };
  const { params } = event.context;
  const upgradeProject = await Project.findById(params!.pid);
  if (!upgradeProject) {
    throw new Error('Invalid request');
  }

  const versioned = new Versioned();
  versioned.logs = log;
  versioned.version = version;
  versioned.project = {
    ...pick(upgradeProject, ['_id', 'prefix', 'family', 'name', 'meta', 'description']),
    users: new Types.DocumentArray([]),
  };
  versioned.icons = await Icon.find({
    project: params!.pid,
  });
  await versioned.save();
  await versioned.updateOne({ step: TaskStatus.INLINE });
  await pushTask(versioned);
  await useLog(event, {
    type: LogType.PROJECT,
    subType: SubLogType.UPDATE,
    content: { version },
  });
  return { code: 0, data: null };
});
