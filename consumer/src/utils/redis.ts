import { Redis } from "ioredis";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import { sleep } from "./process";

dotenv.config();

export const TASK_LIST_NAME = "icon:tasks";

export const CONSUMER_GROUP = "default";

export const CONSUMER_NAME = uuid();

export const BLOCK_TIME = 1000 * 20;

export const redis = new Redis(process.env.NUXT_REDIS_URL!);

export type StreamMessage = [
  key: string,
  items: [id: string, fields: string[]][]
][];

// 创建消费组
export const createConsumeGroup = async () => {
  while (true) {
    const info = await redis.exists(TASK_LIST_NAME);
    if (!info) {
      await sleep(1000 * 20);
    } else {
      console.log("consume source created");
      break;
    }
  }
  try {
    await redis.xgroup("CREATE", TASK_LIST_NAME, CONSUMER_GROUP, "0-0");
    console.log(`group: ${CONSUMER_GROUP} created`);
  } catch (err) {
    console.log(`group: ${CONSUMER_GROUP} already exist!`);
  }
};

export const popTask = (): Promise<StreamMessage | null> =>
  redis.xreadgroup(
    "GROUP",
    CONSUMER_GROUP,
    CONSUMER_NAME,
    "COUNT",
    1,
    "BLOCK",
    BLOCK_TIME,
    "STREAMS",
    TASK_LIST_NAME,
    ">"
  ) as any;

export const ackTask = (id: string) => {
  redis.xack(TASK_LIST_NAME, CONSUMER_GROUP, id);
  redis.xdel(TASK_LIST_NAME, id);
};
