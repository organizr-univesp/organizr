import { Integration } from '@/modules/business/domain/integration.entity';
import { ItemIntegration } from '@/modules/business/domain/item-integration.entity';
import { Item } from '@/modules/business/domain/item.entity';
import { GoogleCalendarService } from '@/modules/business/services/third-party/google-calendar.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemIntegrationService {
    tryGetGoogleCalendar(
        itemIntegrations: ItemIntegration[],
    ): ItemIntegration | undefined {
        return itemIntegrations.find(
            (x) => x.integration.slug === GoogleCalendarService.integrationSlug,
        );
    }

    async findAll(): Promise<ItemIntegration[]> {
        return ItemIntegration.findAll();
    }

    findByItem(item: Item): Promise<ItemIntegration[]> {
        return ItemIntegration.findAll({
            where: {
                itemId: item.id,
            },
            include: [Integration],
        });
    }

    create(
        item: Item,
        integration: Integration,
        eventId: string,
    ): Promise<ItemIntegration> {
        return ItemIntegration.create({
            itemId: item.id,
            integrationId: integration.id,
            externalId: eventId,
        });
    }
}
