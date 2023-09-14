import { Versioned } from "~/server/models";

export default defineEventHandler(async ({ context }) => {
  const { params } = context;
  const versions = await Versioned.find(
    {
      'project._id': params!.pid,
    },
    'logs version build step date -_id'
  ).sort({ date: -1 });

  return {
    code: 0,
    data: versions,
  };
});
