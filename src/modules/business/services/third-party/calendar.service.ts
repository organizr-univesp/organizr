import { IntegrationService } from './../integration.service';
import { ProjectIntegrationService } from './../project-integration.service';
import { UserExternalIntegrationService } from '@/modules/business/services/user-external-integration.service';
import { GoogleCalendarService } from '@/modules/business/services/third-party/google-calendar.service';
import { Project } from '@/modules/business/domain/project.entity';
import { Injectable } from '@nestjs/common';
import { Item } from '@/modules/business/domain/item.entity';
import { addDays, addHours, startOfToday } from 'date-fns';
import { ItemIntegrationService } from '@/modules/business/services/item-integration.service';

@Injectable()
export class CalendarService {
    constructor(
        private readonly userExternalIntegrationService: UserExternalIntegrationService,
        private readonly projectIntegrationService: ProjectIntegrationService,
        private readonly itemIntegrationService: ItemIntegrationService,
        private readonly integrationService: IntegrationService,
        private readonly googleCalendarService: GoogleCalendarService,
    ) {}

    /**
     * Create calendars on every integration of the project's owner (accessed via `project.user`).
     *
     * @param project The project to which the calendars will be attached to.
     * @param name The name of the calendar.
     * @param color The color of the calendar. Note that not all integrations support this.
     */
    async createCalendar(
        project: Project,
        name: string,
        color: string,
    ): Promise<void> {
        const user = project.user;
        const externalIntegrations =
            await this.userExternalIntegrationService.findByUser(user);

        if (
            this.userExternalIntegrationService.hasGoogle(externalIntegrations)
        ) {
            const integration = await this.integrationService.findBySlug(
                GoogleCalendarService.integrationSlug,
            );

            if (!integration) {
                // Integration no more exists or is disabled.
                return;
            }

            // Initialize Google integration
            await this.googleCalendarService.initialize(user);

            // Create the calendar
            const calendarId = await this.googleCalendarService.createCalendar(
                name,
            );

            // Save the ID of the calendar to the database
            await this.projectIntegrationService.create(
                project,
                integration,
                calendarId,
            );
        }

        if (
            this.userExternalIntegrationService.hasTrello(externalIntegrations)
        ) {
            // TODO: Add when Trello integration is done.
        }
    }

    async createEvent(item: Item, name: string) {
        const user = item.project.user;
        const externalIntegrations =
            await this.userExternalIntegrationService.findByUser(user);
        const projectIntegrations =
            await this.projectIntegrationService.findByProject(item.project);
        const start = addHours(addDays(startOfToday(), 1), 9);
        const end = addHours(start, 1);

        if (
            this.userExternalIntegrationService.hasGoogle(externalIntegrations)
        ) {
            const integration = await this.integrationService.findBySlug(
                GoogleCalendarService.integrationSlug,
            );

            // Get Google Calendar integration for this project
            const googleCalendarIntegration =
                this.projectIntegrationService.tryGetGoogleCalendar(
                    projectIntegrations,
                );

            // Initialize Google integration
            await this.googleCalendarService.initialize(user);

            // If it exists
            if (googleCalendarIntegration) {
                // Create the event
                const eventId = await this.googleCalendarService.createEvent(
                    googleCalendarIntegration.externalId,
                    name,
                    start,
                    end,
                );

                // Save the ID of the event to the database
                this.itemIntegrationService.create(item, integration, eventId);
            }
        }

        if (
            this.userExternalIntegrationService.hasTrello(externalIntegrations)
        ) {
            // TODO: Add when Trello integration is done.
        }
    }
}
