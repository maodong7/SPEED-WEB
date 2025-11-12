import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class Submission {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  doi: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  author: string;

  @Prop({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  // 新增审核相关字段
  @Prop({ default: '' })
  moderatorId: string; // 关联users集合的_id

  @Prop({ default: '' })
  reviewComment: string; // 审核意见

  @Prop({ type: Date, default: null })
  reviewTime: Date; // 审核时间
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);