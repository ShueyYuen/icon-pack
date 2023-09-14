import { Model, Schema, model } from 'mongoose';
import mongoose from 'mongoose';

export const AVATAR = 'Avatar';

export interface IAvatar {
  id: string;
  src: string;
  fingerprint: string;
}

const AvatarSchema = new Schema<IAvatar>({
  src: {
    type: String,
    required: true,
  },
  fingerprint: {
    type: String,
    required: true,
  },
});

export const Avatar = (mongoose.models?.[AVATAR] as Model<IAvatar>) || model(AVATAR, AvatarSchema);
