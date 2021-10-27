import { Controller, Get, Render } from '@nestjs/common';

@Controller('app')
export class AppController {
    @Get()
    @Render('private/app/index')
    signIn(): void {
        // Render-only
    }
}
