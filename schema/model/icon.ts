import { Model, Schema, Types, model } from "mongoose";
import mongoose from "mongoose";
import { PROJECT } from "./project";

export const ICON = "Icon";

export interface IIcon {
  id: string;
  name: string;
  class: string;
  project: Types.ObjectId;
  svg: string;
  meta?: Record<string, string | number>;
}

export const IconSchema = new Schema<IIcon>({
  // 展示名称
  name: {
    type: String,
    required: true,
  },
  // 编码名称
  class: {
    type: String,
    required: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: PROJECT,
    required: true,
  },
  svg: {
    type: String,
    required: true,
  },
  meta: {
    type: Map,
    of: String,
  },
});

export const Icon =
  (mongoose.models?.[ICON] as Model<IIcon>) || model(ICON, IconSchema);
