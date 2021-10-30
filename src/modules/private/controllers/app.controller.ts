import { CookieAuthenticationGuard } from '@/modules/private/guards/cookie-authentication.guard';
import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';

@Controller('app')
@UseGuards(CookieAuthenticationGuard)
export class AppController {
    @Get()
    @Redirect('/app/projects')
    app(): void {
        // Redirect-only
    }
}
