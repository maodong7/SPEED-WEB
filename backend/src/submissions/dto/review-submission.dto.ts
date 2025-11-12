import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class ReviewSubmissionDto {
  // 审核结果：通过/驳回
  @IsIn(['approved', 'rejected'])
  status: 'approved' | 'rejected';

  @IsString()
  @IsNotEmpty()
  // 审核意见
  reviewComment: string;
}