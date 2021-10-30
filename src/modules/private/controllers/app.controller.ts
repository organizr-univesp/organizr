import { CookieAuthenticationGuard } from '@/modules/private/guards/cookie-authentication.guard';
import { Controller, Get, Render, UseGuards } from '@nestjs/common';

@Controller('app')
export class AppController {
    @Get()
    @Render('private/app/index')
    @UseGuards(CookieAuthenticationGuard)
    signIn(): void {
        // Render-only
    }
}
