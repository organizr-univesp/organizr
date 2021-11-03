import { CookieAuthenticationGuard } from '@/modules/private/guards/cookie-authentication.guard';
import { LogInWithCredentialsGuard } from '@/modules/private/guards/log-in-with-credentials.guard';
import {
    Controller,
    Get,
    Post,
    Query,
    Render,
    Res,
    UseGuards,
    Logger,
    Req,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly logger: Logger) {}

    @Get('sign-in')
    @Render('public/authentication/sign-in')
    signInGet(
        @Query('wrong-credentials') wrongCredentials: boolean,
    ): Record<string, unknown> {
        return {
            wrongCredentials: wrongCredentials !== undefined,
        };
    }

    @Post('sign-in')
    @UseGuards(LogInWithCredentialsGuard)
    signInPost(@Res() response: Response): void {
        try {
            response.redirect('/app');
        } catch (ex) {
            this.logger.warn('Authentication failure', ex);
            response.redirect('/authentication/sign-in?wrong-credentials');
        }
    }

    @Get('sign-up')
    @Render('public/authentication/sign-up')
    signUpGet(
        @Query('wrong-credentials') wrongCredentials: boolean,
    ): Record<string, unknown> {
        return {
            wrongCredentials: wrongCredentials !== undefined,
        };
    }

    @Post('sign-out')
    @UseGuards(CookieAuthenticationGuard)
    signOut(@Req() request: Request, @Res() response: Response): void {
        request.logOut();
        request.session = null;
        response.redirect('/');
    }
}
