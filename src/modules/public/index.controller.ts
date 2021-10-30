import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class IndexController {
    @Get()
    @Render('public/index/index')
    get(): void {
        // Render-only
    }
}
