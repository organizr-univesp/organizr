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
    Res,
    UseGuards,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';
import { CookieAuthenticationGuard } from '@/modules/private/guards/cookie-authentication.guard';
import { ProjectCreateDto } from '@/modules/private/controllers/projects/models/project-create.dto';

@Controller('app/projects')
@UseGuards(CookieAuthenticationGuard)
export class ProjectsController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly itemService: ItemService,
        private readonly itemIntegrationService: ItemIntegrationService,
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

        const items = await this.itemService.findByProject(project);
        const pendingItems = items.filter((x) => x.finishedAt == null);
        const finishedItems = items.filter((x) => !pendingItems.includes(x));

        return {
            project,
            pendingItems,
            finishedItems,
        };
    }

    @Get('s/:projectSlug/:itemSlug')
    @Render('private/app/projects/items/view')
    async projectItemBySlugs(
        @Param('projectSlug') projectSlug: string,
        @Param('itemSlug') itemSlug: string,
    ): Promise<unknown> {
        const project = await this.projectService.findBySlug(
            this.request.user as User,
            projectSlug,
        );

        const item = await this.itemService.findBySlug(
            this.request.user as User,
            itemSlug,
        );

        const itemIntegrations = await this.itemIntegrationService.findByItem(
            item,
        );

        return {
            project,
            item,
            itemIntegrations,
        };
    }
}
