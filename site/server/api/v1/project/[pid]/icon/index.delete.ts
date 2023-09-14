import { pick } from 'lodash-unified';
import { Icon, LogType, SubLogType } from '~/server/models';

export default defineEventHandler(async (event) => {
  const { id } = (await readBody(event)) as {
    id: string;
  };
  const icon = await Icon.findByIdAndDelete(id);
  if (!icon) {
    return sendNoContent(event, 404);
  }

  await useLog(event, {
    type: LogType.ICON,
    subType: SubLogType.DELETE,
    content: pick(icon, ['name']) as unknown as Record<string, string>,
  });
  return {
    code: 0,
    data: icon._id,
  };
});
