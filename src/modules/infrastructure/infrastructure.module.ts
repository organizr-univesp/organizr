import { LoggerService } from '@/modules/infrastructure/logger.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [LoggerService],
    exports: [LoggerService],
})
export class InfrastructureModule {}
