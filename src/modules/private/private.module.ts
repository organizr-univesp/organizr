import { BusinessModule } from '@/modules/business/business.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { InfrastructureModule } from '@/modules/infrastructure/infrastructure.module';
import { AppController } from '@/modules/private/controllers/app.controller';
import { BusinessExceptionFilter } from '@/modules/private/filters/business-exception.filter';
import { ValidationPipe } from '@/modules/private/pipes/validation.pipe';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule.forRoot(),
        BusinessModule,
        InfrastructureModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: BusinessExceptionFilter,
        },
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class PrivateModule {}
