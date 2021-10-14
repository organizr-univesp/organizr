import { Module } from '@nestjs/common';
import { AppController } from '@/modules/app/controllers/app/index.controller';
import { AppService } from '@/modules/app/services/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
