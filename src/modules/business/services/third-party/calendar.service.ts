import { UserExternalIntegrationService } from '@/modules/business/services/user-external-integration.service';
import { GoogleCalendarService } from '@/modules/business/services/third-party/google/google-calendar.service';
import { Project } from '@/modules/business/domain/project.entity';
import { Injectable } from '@nestjs/common';
import { Item } from '@/modules/business/domain/item.entity';
import { addDays, addHours, startOfToday } from 'date-fns';
import { ItemIntegrationService } from '@/modules/business/services/item-integration.service';
import { ProjectIntegrationService } from '@/modules/business/services/project-integration.service';
import { IntegrationService } from '@/modules/business/services/integration.service';

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
    }

    async createEvent(item: Item, name: string): Promise<void> {
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
                ProjectIntegrationService.tryGetGoogleCalendar(
                    projectIntegrations,
                );

            // If it exists
            if (googleCalendarIntegration) {
                // Initialize Google integration
                await this.googleCalendarService.initialize(user);

                // Create the event
                const eventId = await this.googleCalendarService.createEvent(
                    googleCalendarIntegration.externalId,
                    name,
                    start,
                    end,
                );

                // Save the ID of the event to the database
                await this.itemIntegrationService.create(
                    item,
                    integration,
                    eventId,
                );
            }
        }
    }

    async updateEvent(item: Item, start: Date, end: Date): Promise<void> {
        const user = item.project.user;
        const project = item.project;
        const projectIntegrations =
            await this.projectIntegrationService.findByProject(project);
        const itemIntegrations = await this.itemIntegrationService.findByItem(
            item,
        );

        // Google
        {
            const projectGoogleCalendar =
                ProjectIntegrationService.tryGetGoogleCalendar(
                    projectIntegrations,
                );
            const itemGoogleCalendar =
                ItemIntegrationService.tryGetGoogleCalendar(itemIntegrations);

            if (projectGoogleCalendar && itemGoogleCalendar) {
                // Initialize Google integration
                await this.googleCalendarService.initialize(user);

                // Update event
                await this.googleCalendarService.updateEvent(
                    projectGoogleCalendar.externalId,
                    itemGoogleCalendar.externalId,
                    start,
                    end,
                );
            }
        }
    }
}
