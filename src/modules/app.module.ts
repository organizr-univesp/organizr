import { HttpExceptionFilter } from '@/modules/private/filters/http-exception.filter';
import { PrivateModule } from '@/modules/private/private.module';
import { PublicModule } from '@/modules/public/public.module';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
    imports: [PublicModule, PrivateModule],
    providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
