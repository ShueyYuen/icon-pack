import { Model, Schema, model } from "mongoose";
import mongoose from "mongoose";
import { IProject, ProjectSchema } from "./project";
import { IIcon, IconSchema } from "./icon";

export const VERSION = "Version";

export enum TaskStatus {
  INLINE = 1,
  RUNNING = 2,
  COMPLETE = 3,
  FAILED = 4,
}

export interface IVersion {
  version: string;
  date: Date;
  build: string[];
  step: TaskStatus;
  logs: string;
  project: Omit<IProject, 'id'>;
  icons: IIcon[];
}

const VersionedSchema = new Schema<IVersion>({
  version: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // 构建日志，构建过程中的日志
  build: [String],
  step: {
    type: Number,
    enum: Object.values(TaskStatus),
  },
  // 项目管理员升级版本时填写的日志
  logs: String,
  project: {
    type: ProjectSchema,
    required: true,
  },
  icons: {
    type: [IconSchema],
    default: () => [],
  },
});

export const Versioned =
  (mongoose.models?.[VERSION] as Model<IVersion>) ||
  model(VERSION, VersionedSchema);
