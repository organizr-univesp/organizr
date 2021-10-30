import { Controller, Get, Render } from '@nestjs/common';

@Controller('error')
export class ErrorController {
    @Get('404')
    @Render('public/error/404')
    public notFound(): void {
        // Render-only
    }

    @Get('403')
    @Render('public/error/403')
    public forbidden(): void {
        // Render-only
    }
}
