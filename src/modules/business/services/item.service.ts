import { Item } from '@/modules/business/domain/item';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemService {
    async findAll(): Promise<Item[]> {
        return Item.findAll();
    }
}
