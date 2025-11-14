import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt.config';

// 修复：扩展Request类型时添加declare global，确保类型全局生效且无冲突
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: string }; // 添加?，允许未定义（避免类型强制要求）
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('请先登录');
    }

    // 解析token
    const token = authHeader.split(' ')[1];
    try {
      // 修复：JwtService.verify第二个参数需传配置对象，而非单独secret
      const payload = this.jwtService.verify(token, { secret: jwtConfig.secret });
      req.user = payload; // 将用户信息挂载到req上，供后续接口使用
      next();
    } catch (error) {
      throw new UnauthorizedException('token无效或已过期');
    }
  }
}

// 审核员权限中间件（仅role=moderator可访问）
@Injectable()
export class ModeratorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 增加类型判断，避免req.user为undefined
    if (!req.user || req.user.role !== 'moderator') {
      throw new UnauthorizedException('无审核权限');
    }
    next();
  }
}