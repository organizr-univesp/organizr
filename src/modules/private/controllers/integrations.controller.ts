import { TrelloAuthService } from './../../business/services/third-party/trello/trello-auth.service';
import { User } from '@/modules/business/domain/user.entity';
import { GoogleAuthService } from '@/modules/business/services/third-party/google/google-auth.service';
import { CookieAuthenticationGuard } from '@/modules/private/guards/cookie-authentication.guard';
import {
    Controller,
    Get,
    Injectable,
    Query,
    Redirect,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
@Controller('integrations')
export class IntegrationsController {
    constructor(
        private readonly googleAuthService: GoogleAuthService,
        private readonly trelloAuthService: TrelloAuthService,
    ) {}

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

    @Get('trello')
    @UseGuards(CookieAuthenticationGuard)
    async trelloConnect(@Res() response: Response): Promise<void> {
        response.redirect(
            await this.trelloAuthService.generateAuthUrl(
                response.req.user as User,
            ),
        );
    }

    @Get('trello/callback')
    @Redirect('/app/settings')
    async trelloCallback(
        @Query('oauth_token') token: string,
        @Query('oauth_verifier') verifier: string,
        @Query('user_id') userId: string,
    ) {
        await this.trelloAuthService.validateToken(token, verifier, userId);
    }
}
