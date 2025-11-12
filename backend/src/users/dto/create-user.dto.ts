import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])\w{6,12}$/, {
    message: '密码需6-12位，包含数字和小写字母',
  })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  role?: string; // 可选，默认user
}