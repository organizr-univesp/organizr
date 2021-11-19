import { v4 } from 'uuid';
import { Project } from '@/modules/business/domain/project.entity';
import { User } from '@/modules/business/domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SlugService } from '@/modules/business/services/slug.service';
import { CalendarService } from '@/modules/business/services/third-party/calendar.service';

@Injectable()
export class ProjectService {
    constructor(
        private readonly slugService: SlugService,
        private readonly calendarService: CalendarService,
    ) {}

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

    async create(user: User, name: string, color: string): Promise<Project> {
        let project = await Project.create({
            id: v4(),
            name: name,
            color: color,
            slug: this.slugService.getForName(name),
            userId: user.id,
            user: user,
        });

        project = await Project.findOne({
            where: {
                id: project.id,
            },
            include: [User],
        });

        await this.calendarService.createCalendar(project, name, color);

        return project;
    }
}
