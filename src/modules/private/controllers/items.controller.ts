import { User } from '@/modules/business/domain/user.entity';
import { ItemService } from '@/modules/business/services/item.service';
import {
    Body,
    Controller,
    Inject,
    ParseBoolPipe,
    Post,
    Res,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';

@Controller('app/items')
export class ItemsController {
    constructor(
        private readonly itemService: ItemService,
        @Inject(REQUEST)
        private readonly request: Request,
    ) {}

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
}
