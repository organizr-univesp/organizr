import { Integration } from '@/modules/business/domain/integration.entity';
import { ItemIntegration } from '@/modules/business/domain/item-integration.entity';
import { ItemIntegrationService } from '@/modules/business/services/item-integration.service';
import { Event } from '@/modules/business/services/third-party/models/google-calendar/event';
import { DateTime } from '@/modules/business/integrations/date-time';

export class ItemIntegrationGoogleCalendarDto {
    eventId?: string;
    summary?: string;
    start?: DateTime;
    end?: DateTime;

    constructor(event: Event) {
        this.eventId = event.id;
        this.summary = event.summary;
        this.start = DateTime.fromUtcToZoned(
            event.start.dateTime,
            event.start.timeZone,
        );
        this.end = DateTime.fromUtcToZoned(
            event.end.dateTime,
            event.end.timeZone,
        );
    }
}

export class ItemIntegrationTrelloDto {}

export class ItemIntegrationsDto {
    googleCalendar: {
        enabled: boolean;
        value?: ItemIntegrationGoogleCalendarDto;
        integration?: Integration;
    };

    trello: {
        enabled: boolean;
        value?: ItemIntegrationTrelloDto;
        integration?: Integration;
    };

    constructor(itemIntegrations: ItemIntegration[]) {
        const googleCalendarIntegration =
            ItemIntegrationService.tryGetGoogleCalendar(itemIntegrations);
        const trelloIntegration =
            ItemIntegrationService.tryGetTrello(itemIntegrations);

        this.googleCalendar = {
            enabled: Boolean(googleCalendarIntegration),
            value: {
                eventId: googleCalendarIntegration?.externalId,
            },
            integration: googleCalendarIntegration?.integration,
        };

        this.trello = {
            enabled: Boolean(trelloIntegration),
            value: {
                cardId: trelloIntegration?.externalId,
            },
            integration: trelloIntegration?.integration,
        };
    }

    setGoogleCalendar(
        googleCalendarDto?: ItemIntegrationGoogleCalendarDto,
    ): void {
        this.googleCalendar.enabled = Boolean(googleCalendarDto);
        this.googleCalendar.value = googleCalendarDto;
    }

    setTrello(trelloDto?: ItemIntegrationTrelloDto): void {
        this.trello.enabled = Boolean(trelloDto);
        this.trello.value = trelloDto;
    }
}
