import { Item } from '@/modules/business/domain/item.entity';
import { Project } from '@/modules/business/domain/project.entity';
import { User } from '@/modules/business/domain/user.entity';
import { SlugService } from '@/modules/business/services/slug.service';
import { CalendarService } from '@/modules/business/services/third-party/calendar.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable()
export class ItemService {
    constructor(
        private readonly slugService: SlugService,
        private readonly calendarService: CalendarService,
    ) {}

    async findAll(): Promise<Item[]> {
        return Item.findAll();
    }

    async findByProject(project: Project): Promise<Item[]> {
        return Item.findAll({
            where: {
                projectId: project.id,
            },
        });
    }

    async findById(user: User, id: string): Promise<Item> {
        const result = await Item.findOne({
            where: {
                id: id,
            },
            include: [Project],
        });

        if (result == null || result.project.userId != user.id) {
            throw new NotFoundException('Item não encontrado.');
        }

        return result;
    }

    async findBySlug(user: User, slug: string): Promise<Item | null> {
        const result = await Item.findOne({
            where: {
                slug: slug,
            },
            include: [Project],
        });

        if (result == null || result.project.userId != user.id) {
            throw new NotFoundException('Item não encontrado.');
        }

        return result;
    }

    async create(project: Project, name: string): Promise<Item> {
        let item = await Item.create({
            id: v4(),
            name: name,
            projectId: project.id,
            slug: this.slugService.getForName(name),
        });

        item = await Item.findOne({
            where: {
                id: item.id,
            },
            include: [
                {
                    model: Project,
                    include: [User],
                },
            ],
        });

        this.calendarService.createEvent(item, name);

        return item;
    }
}
