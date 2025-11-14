import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './config/mongoose.config';
import { SubmissionsModule } from './submissions/submissions.module';
import { UsersModule } from './users/users.module';
import { AuthMiddleware, ModeratorMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    MongooseModule.forRootAsync({ useFactory: () => mongooseConfig }),
    SubmissionsModule,
    UsersModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // 全局应用AuthMiddleware（所有接口需登录，除了登录/注册）
      .apply(AuthMiddleware)
      .exclude({ path: 'api/users/(login|register)', method: RequestMethod.POST })
      .forRoutes('*')
      // 对审核相关接口单独应用ModeratorMiddleware（仅审核员可访问）
      .apply(ModeratorMiddleware)
      .forRoutes(
        { path: 'api/submissions/:id/review', method: RequestMethod.POST },
        { path: 'api/submissions/reviewed', method: RequestMethod.GET }
      );
  }
}