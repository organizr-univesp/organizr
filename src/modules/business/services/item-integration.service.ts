import { Integration } from '@/modules/business/domain/integration.entity';
import { ItemIntegration } from '@/modules/business/domain/item-integration.entity';
import { Item } from '@/modules/business/domain/item.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemIntegrationService {
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
