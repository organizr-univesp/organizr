import { User } from '@/modules/business/domain/user.entity';
import { GoogleAuthService } from '@/modules/business/services/third-party/google/google-auth.service';
import { CookieAuthenticationGuard } from '@/modules/private/guards/cookie-authentication.guard';
import {
    Controller,
    Get,
    Injectable,
    Query,
    Redirect,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

@Injectable()
@Controller('integrations')
export class IntegrationsController {
    constructor(private readonly googleAuthService: GoogleAuthService) {}

    @Get('google')
    @UseGuards(CookieAuthenticationGuard)
    googleConnect(@Res() response: Response): void {
        response.redirect(
            this.googleAuthService.generateAuthUrl(response.req.user as User),
        );
    }

    @Get('google/callback')
    @Redirect('/app/settings')
    async googleCallback(
        @Query('code') code: string,
        @Query('state') userId: string,
    ): Promise<void> {
        await this.googleAuthService.validateCode(code, userId);
    }
}
