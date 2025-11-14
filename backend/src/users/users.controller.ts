import { Controller, Post, Get, Body, Param, HttpStatus, UseMiddleware, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AddCollectionDto, RemoveCollectionDto } from './dto/collection.dto';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 原有注册、登录接口不变...

  // 新增：添加收藏（需登录）
  @UseMiddleware(AuthMiddleware)
  @Post('collection/add')
  async addCollection(@Body() dto: AddCollectionDto, @Request() req) {
    return {
      status: HttpStatus.OK,
      message: '收藏成功',
      data: await this.usersService.addCollection(req.user.userId, dto),
    };
  }

  // 新增：取消收藏（需登录）
  @UseMiddleware(AuthMiddleware)
  @Post('collection/remove')
  async removeCollection(@Body() dto: RemoveCollectionDto, @Request() req) {
    return {
      status: HttpStatus.OK,
      message: '取消收藏成功',
      data: await this.usersService.removeCollection(req.user.userId, dto),
    };
  }

  // 新增：获取收藏列表（需登录）
  @UseMiddleware(AuthMiddleware)
  @Get('collections')
  async getCollections(@Request() req) {
    return {
      status: HttpStatus.OK,
      data: await this.usersService.getCollections(req.user.userId),
    };
  }
  // 新增：获取当前用户信息（需登录）
@UseMiddleware(AuthMiddleware)
@Get('profile')
async getProfile(@Request() req) {
  const user = await this.usersService.findById(req.user.userId);
  const { password, ...userInfo } = user.toObject(); // 隐藏密码
  return {
    status: HttpStatus.OK,
    data: userInfo,
  };
}
}