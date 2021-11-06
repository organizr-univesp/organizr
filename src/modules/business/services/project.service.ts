import { Project } from '@/modules/business/domain/project.entity';
import { User } from '@/modules/business/domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

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

    async findBySlug(user: User, slug: string): Promise<Project> {
        const project = await Project.findOne({
            where: {
                userId: user.id,
                slug: slug,
            },
        });

        if (project == null) {
            throw new NotFoundException('Projeto não encontrado.');
        }

        return project;
    }
}
