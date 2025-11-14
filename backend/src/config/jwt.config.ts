import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  // 生产环境需替换为随机字符串，此处测试用
  secret: 'speed-web-secret',
  // token有效期24小时
  signOptions: { expiresIn: '24h' },
};