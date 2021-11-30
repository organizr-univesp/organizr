import { ItemIntegrationGoogleCalendarDto } from './models/item-integrations.dto';
import { ProjectIntegrationsDto } from './models/project-integrations-dto';
import { ItemIntegration } from '@/modules/business/domain/item-integration.entity';
import { ProjectIntegrationService } from '@/modules/business/services/project-integration.service';
import { GoogleCalendarService } from '@/modules/business/services/third-party/google/google-calendar.service';
import { ItemIntegrationService } from '@/modules/business/services/item-integration.service';
import { User } from '@/modules/business/domain/user.entity';
import { ItemService } from '@/modules/business/services/item.service';
import { ProjectService } from '@/modules/business/services/project.service';
import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Render,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';
import { CookieAuthenticationGuard } from '@/modules/private/guards/cookie-authentication.guard';
import { ProjectCreateDto } from '@/modules/private/controllers/projects/models/project-create.dto';
import { ItemIntegrationsDto } from '@/modules/private/controllers/projects/models/item-integrations.dto';

@Controller('app/projects')
@UseGuards(CookieAuthenticationGuard)
export class ProjectsController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly itemService: ItemService,
        private readonly projectIntegrationService: ProjectIntegrationService,
        private readonly itemIntegrationService: ItemIntegrationService,
        private readonly googleCalendarService: GoogleCalendarService,
        @Inject(REQUEST)
        private readonly request: Request,
    ) {}

    @Get('new')
    @Render('private/app/projects/new/index')
    createGet(): void {
        // Render-only
    }

    @Post('new')
    async createPost(
        @Body() projectCreateDto: ProjectCreateDto,
        @Res() response: Response,
    ): Promise<void> {
        const project = await this.projectService.create(
            response.req.user as User,
            projectCreateDto.name,
            projectCreateDto.color,
        );
        response.redirect(`/app/projects/s/${project.slug}`);
    }

    @Get()
    @Render('private/app/projects/index')
    async projects(): Promise<unknown> {
        return {
            projects: await this.projectService.findByUser(
                this.request.user as User,
            ),
        };
    }

    @Get('s/:slug')
    @Render('private/app/projects/view')
    async projectBySlug(@Param('slug') slug: string): Promise<unknown> {
        const project = await this.projectService.findBySlug(
            this.request.user as User,
            slug,
        );

        const projectIntegrations =
            await this.projectIntegrationService.findByProject(project);

        const items = await this.itemService.findByProject(project);
        const pendingItems = items.filter((x) => x.finishedAt == null);
        const finishedItems = items.filter((x) => !pendingItems.includes(x));

        return {
            project,
            pendingItems,
            finishedItems,
            projectIntegrations,
        };
    }

    @Get('s/:projectSlug/:itemSlug')
    @Render('private/app/projects/items/view')
    async projectItemBySlugs(
        @Param('projectSlug') projectSlug: string,
        @Param('itemSlug') itemSlug: string,
        @Req() request: Request,
    ): Promise<unknown> {
        const project = await this.projectService.findBySlug(
            this.request.user as User,
            projectSlug,
        );
        const item = await this.itemService.findBySlug(
            this.request.user as User,
            project.id,
            itemSlug,
        );

        const projectIntegrations =
            await this.projectIntegrationService.findByProject(project);
        const itemIntegrations = await this.itemIntegrationService.findByItem(
            item,
        );

        const projectIntegrationsDto = new ProjectIntegrationsDto(
            projectIntegrations,
        );
        const itemIntegrationsDto = new ItemIntegrationsDto(itemIntegrations);

        if (projectIntegrationsDto.googleCalendarId) {
            if (itemIntegrationsDto.googleCalendar.enabled) {
                await this.googleCalendarService.initialize(
                    request.user as User,
                );

                const event = await this.googleCalendarService.getEvent(
                    projectIntegrationsDto.googleCalendarId,
                    itemIntegrationsDto.googleCalendar.value.eventId,
                );

                itemIntegrationsDto.setGoogleCalendar(
                    new ItemIntegrationGoogleCalendarDto(event),
                );
            }
        }

        return {
            project,
            item,
            itemIntegrations,
            itemIntegrationsDto,
        };
    }
}
