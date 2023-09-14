import { Model, Schema, Types, model } from 'mongoose';
import mongoose from 'mongoose';
import { AVATAR } from './avatar';

export const USER = 'User';

export interface IUser {
  id: string;
  avatar?: Types.ObjectId;
  // 唯一值
  nid: string;
  nickname: string;
  password: string;
  meta: Map<string, string | number>;
}

const UserSchema = new Schema<IUser>({
  avatar: {
    type: Schema.Types.ObjectId,
    ref: AVATAR,
  },
  nid: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  meta: {
    type: Map,
    of: String,
  },
});

export const User = (mongoose.models?.[USER] as Model<IUser>) || model(USER, UserSchema);
