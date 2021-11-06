import { Controller, Get, Render } from '@nestjs/common';

@Controller('app/settings')
export class SettingsController {
    @Get()
    @Render('private/app/settings/index')
    settings(): void {
        // Render-only
    }
}
