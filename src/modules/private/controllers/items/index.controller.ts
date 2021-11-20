import { CalendarService } from '@/modules/business/services/third-party/calendar.service';
import { ItemIntegrationService } from '@/modules/business/services/item-integration.service';
import { ProjectService } from '@/modules/business/services/project.service';
import { User } from '@/modules/business/domain/user.entity';
import { ItemService } from '@/modules/business/services/item.service';
import { ItemCreateDto } from '@/modules/private/controllers/items/models/item-create.dto';
import {
    Body,
    Controller,
    Inject,
    Param,
    ParseBoolPipe,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';
import { CookieAuthenticationGuard } from '@/modules/private/guards/cookie-authentication.guard';
import { UpdateEvent } from '@/modules/private/controllers/items/models/update-event';
import { DateTime } from '@/modules/business/integrations/date-time';
import { Item } from '@/modules/business/domain/item.entity';
import { Project } from '@/modules/business/domain/project.entity';

@Controller('app/items')
@UseGuards(CookieAuthenticationGuard)
export class ItemsController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly itemService: ItemService,
        private readonly itemIntegrationService: ItemIntegrationService,
        private readonly calendarService: CalendarService,
        @Inject(REQUEST)
        private readonly request: Request,
    ) {}

    private getItemRedirectUrl(project: Project, item: Item) {
        return (
            this.request.headers.referer ||
            `/app/projects/s/${project.slug}/${item.slug}`
        );
    }

    @Post()
    public async create(
        @Body() itemCreateDto: ItemCreateDto,
        @Res() response: Response,
    ): Promise<void> {
        const project = await this.projectService.findById(
            response.req.user as User,
            itemCreateDto.projectId,
        );

        const item = await this.itemService.create(project, itemCreateDto.name);

        response.redirect(this.getItemRedirectUrl(project, item));
    }

    @Post('finish')
    public async finish(
        @Body('id') id: string,
        @Body('finished', ParseBoolPipe) finished: boolean,
        @Res() response: Response,
    ): Promise<void> {
        const item = await this.itemService.findById(
            this.request.user as User,
            id,
        );

        if (finished) {
            item.finishedAt = new Date();
        } else {
            item.finishedAt = null;
        }

        await item.save();

        const redirectUrl =
            response.req.headers.referer ||
            `/app/projects/s/${item.project.slug}`;

        response.redirect(redirectUrl);
    }

    @Post('delete')
    public async delete(
        @Body('id') id: string,
        @Res() response: Response,
    ): Promise<void> {
        const item = await this.itemService.findById(
            this.request.user as User,
            id,
        );

        item.destroy();

        await item.save();

        response.redirect(`/app/projects/s/${item.project.slug}`);
    }

    @Post(':id/integrations/google-calendar')
    public async updateGoogleCalendar(
        @Param('id') id,
        @Body() updateEventRequest: UpdateEvent,
        @Res() response: Response,
    ): Promise<void> {
        const item = await this.itemService.findById(
            this.request.user as User,
            id,
        );

        const startUtc = DateTime.fromZonedToUtc(
            updateEventRequest.start,
            updateEventRequest.timeZone,
        );
        const endUtc = DateTime.fromZonedToUtc(
            updateEventRequest.end,
            updateEventRequest.timeZone,
        );

        await this.calendarService.updateEvent(
            item,
            startUtc.date,
            endUtc.date,
        );

        // TODO: Create logic to update an item on Google Calendar.
        return response.redirect(this.getItemRedirectUrl(item.project, item));
    }
}
