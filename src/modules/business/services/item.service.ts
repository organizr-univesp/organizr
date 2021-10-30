import { Item } from '@/modules/business/domain/item.entity';
import { Project } from '@/modules/business/domain/project.entity';
import { User } from '@/modules/business/domain/user.entity';
import { Injectable } from '@nestjs/common';

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

    async findById(user: User, id: string): Promise<Item | null> {
        const result = await Item.findOne({
            where: {
                id: id,
            },
            include: [Project],
        });

        if (result.project.userId != user.id) {
            return undefined;
        }

        return result;
    }
}
