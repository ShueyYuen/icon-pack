import { Model, Schema, Types, model } from 'mongoose';
import mongoose from 'mongoose';
import { PROJECT } from './project';
import { USER } from './user';

export const LOG = 'Log';

export type OldSuffix<T> = {
  [K in keyof T as `${string & K}__old`]: T[K];
} & T;

export enum LogType {
  // 项目日志
  PROJECT = 'project',
  // 权限日志
  PERMISSION = 'permission',
  // 图标修改日志
  ICON = 'icon',
}

export enum SubLogType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  MIGRATE = 'migrate',
}

export interface ILog {
  id: string;
  type: LogType;
  subType: SubLogType;
  project: Types.ObjectId;
  user: Types.ObjectId;
  content?: Record<string, string>;
  createdAt: Date;
}

export const LogSchema = new Schema<ILog>({
  type: {
    type: String,
    enum: Object.values(LogType),
    required: true,
  },
  subType: {
    type: String,
    enum: Object.values(SubLogType),
    required: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: PROJECT,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: USER,
    required: true,
  },
  content: {
    type: Map,
    of: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Log = (mongoose.models?.[LOG] as Model<ILog>) || model(LOG, LogSchema);
