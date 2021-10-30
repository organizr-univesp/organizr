import { BusinessModule } from '@/modules/business/business.module';
import { PublicOnlyMiddleware } from '@/modules/private/middlewares/public-only.middleware';
import { AuthenticationController } from '@/modules/public/authentication/authentication.controller';
import { ErrorController } from '@/modules/public/error.controller';
import { IndexController } from '@/modules/public/index.controller';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({
    imports: [BusinessModule],
    providers: [Logger],
    controllers: [IndexController, AuthenticationController, ErrorController],
})
export class PublicModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(PublicOnlyMiddleware)
            .exclude('/authentication/sign-out')
            .forRoutes('/authentication/*');
    }
}
