import { defaults } from 'lodash-unified';
import { Log, LogType } from '~/server/models';

export default defineEventHandler(async (event) => {
  const { params } = event.context;
  const paged = defaults(Object.fromEntries(getRequestURL(event).searchParams), {
    page: '0',
    limit: '15',
  });
  const project = params!.pid;
  const type = params!.type as LogType;
  const count = await Log.find({ project, type }).count();
  const page = Number(paged.page);
  const limit = Number(paged.limit);
  const result = await Log.find({ project, type })
    .skip(page * limit)
    .limit(limit)
    .populate('user', 'nickname id')
    .sort({ createdAt: -1 });

  return {
    code: 0,
    count,
    data: result,
  };
});
