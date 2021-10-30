import { ItemIntegration } from '@/modules/business/domain/item-integration.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemIntegrationService {
    async findAll(): Promise<ItemIntegration[]> {
        return ItemIntegration.findAll();
    }
}
