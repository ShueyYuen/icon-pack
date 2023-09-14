import { pick } from 'lodash-unified';
import { LATEST_VERSION } from '~/constant';
import { IIcon, Icon, Versioned } from '~/server/models';

const pickIcons = (icons: IIcon[]) =>
  icons.map((icon) => pick(icon, ['id', 'name', 'class', 'svg']));

export default defineEventHandler(async ({ context }) => {
  const { params } = context;
  const project = params!.pid;
  const version = params!.version;
  if (version === LATEST_VERSION) {
    const result = await Icon.find({ project });
    return { code: 0, data: pickIcons(result) };
  } else {
    const result = await Versioned.find({
      'project._id': project,
      version,
    });
    if (result.length === 0) {
      return { code: 0, data: [] };
    }
    return {
      code: 0,
      data: {
        icons: pickIcons(result[0].icons),
        config: pick(result[0].project, ['family', 'prefix']),
      },
    };
  }
});
