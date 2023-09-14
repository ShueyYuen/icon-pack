import { ILog, Log } from '../models';

export { LogType, SubLogType } from '../models';

export async function useLog(
  event: import('h3').H3Event,
  { project, user, type, subType, content }: Partial<ILog>
) {
  const iProject = project ?? event.context.params!.pid;
  if (!iProject) {
    throw new Error('Trying to save a log without Project!');
  }
  const session = await useSession(event);
  const iUser = user ?? session?.user?.id;
  if (!iUser) {
    throw new Error('Trying to save a log without User!');
  }
  const iType = type!;
  const iSubType = subType!;
  if (!iType || !iSubType) {
    throw new Error('Trying to save a log without Content!');
  }
  const log = new Log({
    project: iProject,
    user: iUser,
    type: iType,
    subType: iSubType,
    content,
  });
  await log.save();
}
