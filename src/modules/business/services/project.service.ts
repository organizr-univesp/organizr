import { Project } from '@/modules/business/domain/project.entity';
import { User } from '@/modules/business/domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProjectService {
    private ensureFound(project: Project) {
        if (project == null) {
            throw new NotFoundException('Projeto não encontrado.');
        }
    }

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

        this.ensureFound(project);

        return project;
    }

    async findById(user: User, id: string): Promise<Project> {
        const project = await Project.findOne({
            where: {
                userId: user.id,
                id: id,
            },
        });

        this.ensureFound(project);

        return project;
    }
}
