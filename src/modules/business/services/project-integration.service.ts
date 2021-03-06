import { TrelloService } from '@/modules/business/services/third-party/trello/trello.service';
import { Integration } from '@/modules/business/domain/integration.entity';
import { ProjectIntegration } from '@/modules/business/domain/project-integration.entity';
import { Project } from '@/modules/business/domain/project.entity';
import { GoogleCalendarService } from '@/modules/business/services/third-party/google/google-calendar.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectIntegrationService {
    static tryGetGoogleCalendar(
        projectIntegrations: ProjectIntegration[],
    ): ProjectIntegration | null {
        return projectIntegrations.find(
            (x) => x.integration.slug === GoogleCalendarService.integrationSlug,
        );
    }

    static tryGetTrello(
        projectIntegrations: ProjectIntegration[],
    ): ProjectIntegration | null {
        return projectIntegrations.find(
            (x) => x.integration.slug === TrelloService.integrationSlug,
        );
    }

    async findAll(): Promise<ProjectIntegration[]> {
        return ProjectIntegration.findAll();
    }

    findByProject(project: Project): Promise<ProjectIntegration[]> {
        return ProjectIntegration.findAll({
            where: {
                projectId: project.id,
            },
            include: [Integration],
        });
    }

    async create(
        project: Project,
        integration: Integration,
        externalId: string,
    ): Promise<ProjectIntegration> {
        return ProjectIntegration.create({
            projectId: project.id,
            integrationId: integration.id,
            externalId: externalId,
        });
    }
}
