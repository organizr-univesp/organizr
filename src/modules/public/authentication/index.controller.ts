import { User } from './../../business/domain/user.entity';
import { UserService } from '@/modules/business/services/user.service';
import { CookieAuthenticationGuard } from '@/modules/private/guards/cookie-authentication.guard';
import { LogInWithCredentialsGuard } from '@/modules/private/guards/log-in-with-credentials.guard';
import { ForgotPasswordDto } from '@/modules/public/authentication/models/forgot-password.dto';
import { SignUpDto } from '@/modules/public/authentication/models/sign-up.dto';
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
    Body,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly userService: UserService,
        private readonly logger: Logger,
    ) {}

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
    signUpGet(): void {
        // Render-only
    }

    @Post('sign-up')
    async signUpPost(
        @Body() signUpDto: SignUpDto,
        @Res() response: Response,
    ): Promise<void> {
        const user = await this.userService.create(
            signUpDto.fullName,
            signUpDto.email,
            signUpDto.password,
            signUpDto.confirmPassword,
        );

        await new Promise((res) => response.req.logIn(user, res));
        response.redirect('/app');
    }

    @Post('sign-out')
    @UseGuards(CookieAuthenticationGuard)
    signOut(@Req() request: Request, @Res() response: Response): void {
        request.logOut();
        request.session = null;
        response.redirect('/');
    }

    @Get('forgot-password')
    @Render('public/authentication/forgot-password')
    forgotPasswordGet(): void {
        // Render-only
    }

    @Post('forgot-password')
    async forgotPasswordPost(
        @Body() forgotPasswordDto: ForgotPasswordDto,
        @Res() response: Response,
    ): Promise<void> {
        const user = await User.findOne({
            where: {
                email: forgotPasswordDto.email,
            },
        });

        if (user) {
            const newPassword = await this.userService.refreshPassword(user);
            this.userService.sendForgotPasswordEmail(user, newPassword);
        }

        response.redirect('/authentication/forgot-password/success');
    }

    @Get('forgot-password/success')
    @Render('public/authentication/forgot-password-success')
    forgotPasswordSuccess(): void {
        // Render-only
    }
}
