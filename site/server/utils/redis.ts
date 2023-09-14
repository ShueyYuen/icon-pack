import { Redis } from "ioredis";
import { Types } from "mongoose";
import { IVersion } from "~/server/models";

export const TASK_LIST_NAME = "icon:tasks";

if (!process.env.NUXT_REDIS_URL) {
  createError({
    statusCode: 500,
    statusMessage: "NUXT_REDIS_URL is not set",
  });
}

export const redis = new Redis(process.env.NUXT_REDIS_URL!);

export const pushTask = (
  task: IVersion & { _id: Types.ObjectId }
): Promise<string | null> => {
  const map = [
    'id',
    task._id.toString(),
    'name',
    task.project.name,
    'prefix',
    task.project.prefix,
    'family',
    task.project.family,
    'icons',
    JSON.stringify(task.icons),
    'version',
    task.version,
    'description',
    task.project.description || '',
  ];
  return redis.xadd(TASK_LIST_NAME, "*", ...map);
};
