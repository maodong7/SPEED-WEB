import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from './schemas/submission.schema';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
  ) {}

  // 创建文献提交
  async create(createSubmissionDto: CreateSubmissionDto, userId: string): Promise<Submission> {
    const createdSubmission = new this.submissionModel({
      ...createSubmissionDto,
      status: 'pending', // 初始状态为待审核
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return createdSubmission.save();
  }

  // 查询所有提交（管理员/审核员用）
  async findAll(): Promise<Submission[]> {
    return this.submissionModel.find().sort({ createdAt: -1 }).exec();
  }

  // 查询单个提交详情
  async findOne(id: string): Promise<Submission> {
    const submission = await this.submissionModel.findById(id).exec();
    if (!submission) {
      throw new NotFoundException('文献不存在');
    }
    return submission;
  }

  // 查询待审核文献（审核员用）
  async findPending(): Promise<Submission[]> {
    return this.submissionModel
      .find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .exec();
  }

  // 新增：查询所有已通过审核的文献（供用户浏览收藏）
  async findApproved(): Promise<Submission[]> {
    return this.submissionModel
      .find({ status: 'approved' })
      .sort({ reviewTime: -1 })
      .exec();
  }

  // 审核文献
  async review(
    id: string,
    reviewDto: ReviewSubmissionDto,
    moderatorId: string,
  ): Promise<Submission> {
    const submission = await this.submissionModel.findById(id).exec();
    if (!submission) {
      throw new NotFoundException('文献不存在');
    }
    if (submission.status !== 'pending') {
      throw new ForbiddenException('该文献已审核，不可重复操作');
    }

    // 更新审核状态和信息
    submission.status = reviewDto.status;
    submission.reviewComment = reviewDto.reviewComment;
    submission.moderatorId = moderatorId;
    submission.reviewTime = new Date();
    submission.updatedAt = new Date();

    return submission.save();
  }

  // 删除文献提交（仅作者或管理员可操作）
  async remove(id: string, userId: string, isModerator: boolean): Promise<void> {
    const submission = await this.submissionModel.findById(id).exec();
    if (!submission) {
      throw new NotFoundException('文献不存在');
    }

    // 非管理员且非作者，无删除权限
    if (!isModerator && submission.userId !== userId) {
      throw new ForbiddenException('无删除权限');
    }

    await this.submissionModel.findByIdAndDelete(id).exec();
  }
}