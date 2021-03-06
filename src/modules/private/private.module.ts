import { BusinessModule } from '@/modules/business/business.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { AppController } from '@/modules/private/controllers/app.controller';
import { IntegrationsController } from '@/modules/private/controllers/integrations.controller';
import { ItemsController } from '@/modules/private/controllers/items/index.controller';
import { ProjectsController } from '@/modules/private/controllers/projects/index.controller';
import { SettingsController } from '@/modules/private/controllers/settings.controller';
import { ValidationPipe } from '@/modules/private/pipes/validation.pipe';
import { LocalSerializer } from '@/modules/private/serializer/local.serializer';
import { LocalStrategy } from '@/modules/private/strategies/local.strategy';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule.forRoot(),
        BusinessModule,
        PassportModule,
    ],
    controllers: [
        AppController,
        ProjectsController,
        ItemsController,
        SettingsController,
        IntegrationsController,
    ],
    providers: [
        Logger,
        LocalStrategy,
        LocalSerializer,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class PrivateModule {}
