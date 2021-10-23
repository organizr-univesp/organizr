import { IntegrationCategory } from '@/modules/business/domain/integration-category';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationCategoryService {
    async findAll(): Promise<IntegrationCategory[]> {
        return IntegrationCategory.findAll();
    }
}
