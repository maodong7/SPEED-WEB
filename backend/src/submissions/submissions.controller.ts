import { Controller, Post, Get, Body, Param, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
// 修复：NestJS中间件需通过模块configure注册，而非@UseMiddleware装饰器
// 移除AuthMiddleware、ModeratorMiddleware的导入，改为在模块中配置

@Controller('api/submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // 原有接口：create、findPending 不变...

  // 新增：审核文献接口（权限通过模块中间件控制，无需装饰器）
  @Post(':id/review')
  async reviewSubmission(
    @Param('id') submissionId: string,
    @Body() reviewDto: ReviewSubmissionDto,
    @Request() req, // 获取中间件挂载的用户信息
  ) {
    // 增加req.user存在性判断
    if (!req.user) {
      throw new UnauthorizedException('请先登录');
    }
    return {
      status: HttpStatus.OK,
      message: '审核成功',
      data: await this.submissionsService.reviewSubmission(
        submissionId,
        reviewDto,
        req.user.userId, // 审核员ID
      ),
    };
  }

  // 新增：查询已审核文献接口
  @Get('reviewed')
  async findReviewed() {
    return {
      status: HttpStatus.OK,
      data: await this.submissionsService.findReviewed(),
    };
  }
}