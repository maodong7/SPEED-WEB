import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AddCollectionDto, RemoveCollectionDto } from './dto/collection.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Submission, SubmissionDocument } from '../submissions/schemas/submission.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
    private jwtService: JwtService,
  ) {}

  // 原有注册、登录、findById方法不变...

  // 新增：添加收藏
  async addCollection(userId: string, dto: AddCollectionDto): Promise<User> {
    // 检查文献是否存在
    const submission = await this.submissionModel.findById(dto.submissionId);
    if (!submission) {
      throw new NotFoundException('文献不存在');
    }

    // 检查是否已收藏
    const user = await this.userModel.findById(userId);
    if (user.collections.includes(dto.submissionId)) {
      throw new ConflictException('已收藏该文献');
    }

    // 添加收藏
    user.collections.push(dto.submissionId);
    return user.save();
  }

  // 新增：取消收藏
  async removeCollection(userId: string, dto: RemoveCollectionDto): Promise<User> {
    const user = await this.userModel.findById(userId);
    // 检查是否已收藏
    if (!user.collections.includes(dto.submissionId)) {
      throw new NotFoundException('未收藏该文献');
    }

    // 取消收藏
    user.collections = user.collections.filter(id => id !== dto.submissionId);
    return user.save();
  }

  // 新增：获取用户收藏列表
  async getCollections(userId: string): Promise<Submission[]> {
    const user = await this.userModel.findById(userId);
    // 查询收藏的文献详情
    return this.submissionModel.find({ _id: { $in: user.collections } }).exec();
  }
}