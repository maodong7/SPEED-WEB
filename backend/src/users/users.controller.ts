import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 注册接口
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return {
      status: HttpStatus.CREATED,
      message: '注册成功',
      data: await this.usersService.create(createUserDto),
    };
  }

  // 登录接口
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const result = await this.usersService.login(loginUserDto);
    return {
      status: HttpStatus.OK,
      message: '登录成功',
      data: result,
    };
  }
}