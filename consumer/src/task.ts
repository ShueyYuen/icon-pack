import { Writable } from "stream";
import { execa } from "execa";
import { TaskStatus, Versioned } from "./model";
import mongoose from "mongoose";

export interface Icon {
  name: string;
  class: string;
  svg: string;
}
export interface Task {
  id: string;
  stream: string;
  message: string;
  name: string;
  prefix: string;
  family: string;
  version: string;
  description: string;
  icons: Array<Icon>;
}

export const parseTasks = (streamName: string, tasks: Array<[id: string, fields: string[]]>) => {
  return tasks.map((item) => {
    const task = item[1];
    const mapped = Object.assign(
      {
        stream: streamName,
        message: item[0],
      },
      task.reduce((pre, cur, index) => {
        index % 2 === 0 ? (pre[cur] = '') : (pre[task[index - 1]] = cur);
        return pre;
      }, {} as Record<string, string>)
    );
    mapped.icons = JSON.parse(mapped.icons);
    return mapped as unknown as Task;
  });
};

const getWritableStream = () => {
  const logs: Array<string> = [];
  return {
    stream: new Writable({
      write(chunk, encoding, callback) {
        const log = chunk.toString().trim();
        logs.push(log);
        callback();
      },
      final(callback) {
        console.log('build icons successfully!');
        callback();
      },
    }),
    logs,
  };
};

export const buildTask = async (task: Task) => {
  const { id, prefix, family, version, description } = task;
  await mongoose.connect(process.env.NUXT_MONGO_URL!);
  const versioned = await Versioned.findById(id);
  if (!versioned) {
    console.error('version has already been deleted!');
    return;
  }
  const { stream: writableStream, logs } = getWritableStream();
  try {
    await versioned.updateOne({ step: TaskStatus.RUNNING });
    const build = execa(`pnpm`, ['build'], {
      env: {
        PACKAGE_GROUP: process.env.PACKAGE_GROUP,
        PACKAGE_REGISTRY: process.env.PACKAGE_REGISTRY,
        PACKAGE_AUTH_TOKEN: process.env.PACKAGE_AUTH_TOKEN,

        PACKAGE_PREFIX: prefix,
        PACKAGE_NAME: family,
        PACKAGE_VERSION: version,
        PACKAGE_DESCRIPTION: description,
      },
      cwd: '../template',
      stdio: 'pipe',
      all: true,
    });
    if (!build.pipeAll) {
      return;
    }
    await build.pipeAll(writableStream);
    await versioned.updateOne({ step: TaskStatus.COMPLETE, build: logs });
  } catch (error) {
    await versioned.updateOne({ step: TaskStatus.FAILED, build: logs });
  }
};
