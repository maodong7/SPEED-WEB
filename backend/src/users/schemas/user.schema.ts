import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['user', 'moderator'], default: 'user' })
  role: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [String], default: [] }) // 新增：收藏的文献ID数组
  collections: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);