import { ProjectIntegration } from '@/modules/business/domain/project-integration.entity';
import { ProjectIntegrationService } from '@/modules/business/services/project-integration.service';
export class ProjectIntegrationsDto {
    googleCalendarId?: string;
    trelloId?: string;

    constructor(projectIntegrations: ProjectIntegration[]) {
        const googleCalendarIntegration =
            ProjectIntegrationService.tryGetGoogleCalendar(projectIntegrations);
        if (googleCalendarIntegration) {
            this.setGoogleCalendarId(googleCalendarIntegration.externalId);
        }

        const trelloIntegration =
            ProjectIntegrationService.tryGetTrello(projectIntegrations);
        if (trelloIntegration) {
            this.setTrelloId(trelloIntegration.externalId);
        }
    }

    setGoogleCalendarId(calendarId?: string): void {
        this.googleCalendarId = calendarId;
    }

    setTrelloId(trelloId?: string): void {
        this.trelloId = trelloId;
    }
}
