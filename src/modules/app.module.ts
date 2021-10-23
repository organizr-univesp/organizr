import { PrivateModule } from '@/modules/private/private.module';
import { PublicModule } from '@/modules/public/public.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [PublicModule, PrivateModule],
})
export class AppModule {}
