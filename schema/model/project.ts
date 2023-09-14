import { Schema, Types, Model, model } from "mongoose";
import mongoose from "mongoose";
import { USER } from "./user";

export const PROJECT = "Project";

export enum ProjectRole {
  OWNER = 0,
  ADMIN = 1,
  MEMBER = 2,
  READONLY = 3,
}

export interface ProjectUser {
  id: Types.ObjectId;
  role: ProjectRole;
}

export interface IProject {
  id: string;
  name: string;
  description: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  family: string;
  prefix: string;
  users: Array<ProjectUser>;
  meta: Record<string, string | number>;
}

export const editableProjectKey = ['name', 'description', 'prefix', 'family'] as const;

export type EditableProject = Pick<IProject, (typeof editableProjectKey)[number]>;

export const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
  },
  description: String,
  deletedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  // 图标名称
  family: {
    type: String,
    required: true,
  },
  // 组件前缀
  prefix: {
    type: String,
    required: true,
  },
  users: {
    type: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: USER,
          required: true,
        },
        role: {
          type: Number,
          enum: Object.values(ProjectRole),
        },
      },
    ],
    default: () => [],
  },
  meta: {
    type: Map,
    of: String,
  },
});

export const Project =
  (mongoose.models?.[PROJECT] as Model<IProject>) ||
  model(PROJECT, ProjectSchema);
