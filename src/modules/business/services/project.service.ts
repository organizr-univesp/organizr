import { Project } from '@/modules/business/domain/project.entity';
import { User } from '@/modules/business/domain/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectService {
    async findAll(): Promise<Project[]> {
        return Project.findAll();
    }

    findByUser(user: User): Promise<Project[]> {
        return Project.findAll({
            where: {
                userId: user.id,
            },
        });
    }

    findBySlug(user: User, slug: string): Promise<Project | null> {
        return Project.findOne({
            where: {
                userId: user.id,
                slug: slug,
            },
        });
    }
}
