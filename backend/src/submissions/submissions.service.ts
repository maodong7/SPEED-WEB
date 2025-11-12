import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from './schemas/submission.schema';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
    private usersService: UsersService, // 注入用户服务，关联审核员
  ) {}

  // 原有方法：create、findPending 不变...

  // 新增：审核文献方法
  async reviewSubmission(
    submissionId: string,
    reviewDto: ReviewSubmissionDto,
    moderatorId: string,
  ): Promise<Submission> {
    // 检查文献是否存在
    const submission = await this.submissionModel.findById(submissionId);
    if (!submission) {
      throw new NotFoundException('文献不存在');
    }

    // 检查审核员是否存在
    await this.usersService.findById(moderatorId);

    // 更新审核信息
    submission.status = reviewDto.status;
    submission.reviewComment = reviewDto.reviewComment;
    submission.moderatorId = moderatorId;
    submission.reviewTime = new Date();

    return submission.save();
  }

  // 新增：查询已审核的文献（供审核员查看历史）
  async findReviewed(): Promise<Submission[]> {
    return this.submissionModel
      .find({ status: { $in: ['approved', 'rejected'] } })
      .sort({ reviewTime: -1 })
      .exec();
  }
}