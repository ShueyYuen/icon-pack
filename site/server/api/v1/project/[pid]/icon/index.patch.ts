import { pick } from 'lodash-unified';
import { IIcon, Icon, LogType, OldSuffix, SubLogType } from '~/server/models';

type NoneProjectIcon = Omit<IIcon, 'project'>;

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as NoneProjectIcon;
  const icon = await Icon.findByIdAndUpdate(body.id, pick(body, ['class', 'name', 'svg']), {
    returnOriginal: true,
  });
  if (!icon) {
    return sendNoContent(event, 404);
  }
  const logContent = (Object.keys(body) as (keyof NoneProjectIcon)[]).reduce(
    (acc, key) => {
      if (icon[key] !== body[key]) {
        acc[key] = body[key];
        acc[`${key}__old`] = icon[key];
      }
      return acc;
    },
    {
      name: body.name ?? icon.name,
    } as OldSuffix<Partial<NoneProjectIcon>>
  );
  if (Object.keys(logContent).length > 0) {
    await useLog(event, {
      type: LogType.ICON,
      subType: SubLogType.UPDATE,
      content: logContent,
    });
  }
  return {
    code: 0,
    data: icon._id,
  };
});
