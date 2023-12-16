import mongoose from "mongoose";
import { emptyDir, ensureDir } from "fs-extra";
import {
  ackTask,
  parseTasks,
  popTask,
  sleep,
  createConsumeGroup,
  clearSvgPath,
  writeSvgFile,
  buildTask,
  Task,
  ICON_BASE_DIRE,
  type StreamMessage,
  type Icon,
} from "./src";

const dumpIconFiles = async (icons: Icon[], task: Task) => {
  await ensureDir(ICON_BASE_DIRE);
  await emptyDir(ICON_BASE_DIRE);
  return Promise.all(
    icons.map((icon) =>
      writeSvgFile(`${task.family}-${icon.class}`.replace(/^-/, ""), icon.svg)
    )
  );
};
async function processTaskStreamResponse(response: StreamMessage) {
  for (const item of response) {
    const [streamName, tasks] = item;
    const parsed = parseTasks(streamName, tasks);
    for (const task of parsed) {
      clearSvgPath();
      dumpIconFiles(task.icons, task);
      await buildTask(task);
      ackTask(task.message);
    }
    await sleep(100 * 1);
  }
}

async function main() {
  console.log("Start consumer...");
  await createConsumeGroup();
  while (true) {
    const response = await popTask();
    if (!response) {
      // 没有消息则等待10秒
      await sleep(1000 * (5 + Math.random() * 5));
      continue;
    }
    await processTaskStreamResponse(response);
  }
}

async function initMongoConnect() {
  try {
    if (!process.env.NUXT_MONGO_URL) {
      throw new Error("NUXT_MONGO_URL env not found");
    }
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.NUXT_MONGO_URL);
  } catch (error) {
    throw new Error("Something went wrong.");
  }
}

await initMongoConnect();

main();
