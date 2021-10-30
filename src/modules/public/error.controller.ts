import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('error')
export class ErrorController {
    @Get('404')
    @Render('public/error/404')
    public notFound(@Req() request: Request): unknown {
        return {
            authenticated: request.isAuthenticated(),
        };
    }

    @Get('403')
    @Render('public/error/403')
    public forbidden(): void {
        // Render-only
    }
}
