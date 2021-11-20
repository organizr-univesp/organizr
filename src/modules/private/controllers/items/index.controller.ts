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
import { UpdateGoogleCalendar } from '@/modules/private/controllers/items/models/update-google-calendar';

@Controller('app/items')
@UseGuards(CookieAuthenticationGuard)
export class ItemsController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly itemService: ItemService,
        @Inject(REQUEST)
        private readonly request: Request,
    ) {}

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

        const redirectUrl =
            response.req.headers.referer ||
            `/app/projects/s/${project.slug}/${item.slug}`;

        response.redirect(redirectUrl);
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
        @Body() updateRequest: UpdateGoogleCalendar,
    ) {
        // TODO: Create logic to update an item on Google Calendar.
        return {};
    }
}
