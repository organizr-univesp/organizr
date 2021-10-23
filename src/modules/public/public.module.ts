import { IndexController } from '@/modules/public/index/index.controller';
import { Module } from '@nestjs/common';

@Module({
    controllers: [IndexController],
})
export class PublicModule {}
