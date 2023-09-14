import { pick } from 'lodash-unified';
import { IIcon, Icon, LogType, SubLogType } from '~/server/models';

export default defineEventHandler(async (event) => {
  const { icons } = (await readBody(event)) as {
    icons: Array<IIcon>;
  };
  const { params } = event.context;
  icons
    .map((icon) => ({
      ...icon,
      project: params!.pid,
    }))
    .forEach(async (icon) => {
      const iconDoc = new Icon(icon);
      await useLog(event, {
        type: LogType.ICON,
        subType: SubLogType.CREATE,
        content: pick(icon, ['name']) as unknown as Record<string, string>,
      });
      await iconDoc.save();
    });
  return { code: 0, data: true };
});
