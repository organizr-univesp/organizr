import { Item } from '@/modules/business/domain/item.entity';
import { Project } from '@/modules/business/domain/project.entity';
import { User } from '@/modules/business/domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import dashify = require('dashify');
import { v4 } from 'uuid';

@Injectable()
export class ItemService {
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

    create(project: Project, name: string): Promise<Item> {
        return Item.create({
            id: v4(),
            name: name,
            projectId: project.id,
            slug: this.getSlugForName(name),
        });
    }

    private getSlugForName(name: string): string {
        let result: string = dashify(name).replace(/[^A-Za-z0-9-]/g, '');

        if (result.startsWith('-')) {
            result = result.substring(1);
        }

        return result;
    }
}
