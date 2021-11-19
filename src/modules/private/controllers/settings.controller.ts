import { User } from '@/modules/business/domain/user.entity';
import { UserExternalIntegrationService } from '@/modules/business/services/user-external-integration.service';
import { CookieAuthenticationGuard } from '@/modules/private/guards/cookie-authentication.guard';
import { Controller, Get, Inject, Render, UseGuards } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Controller('app/settings')
@UseGuards(CookieAuthenticationGuard)
export class SettingsController {
    constructor(
        private readonly userExternalIntegrationService: UserExternalIntegrationService,
        @Inject(REQUEST)
        private readonly request: Request,
    ) {}

    @Get()
    @Render('private/app/settings/index')
    async settings(): Promise<unknown> {
        const externalIntegrations =
            await this.userExternalIntegrationService.findByUser(
                this.request.user as User,
            );

        return {
            externalIntegrations: {
                hasGoogle:
                    this.userExternalIntegrationService.hasGoogle(
                        externalIntegrations,
                    ),
                hasTrello:
                    this.userExternalIntegrationService.hasTrello(
                        externalIntegrations,
                    ),
            },
        };
    }
}
