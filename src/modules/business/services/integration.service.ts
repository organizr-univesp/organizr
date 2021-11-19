import { Integration } from '@/modules/business/domain/integration.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationService {
    async findAll(): Promise<Integration[]> {
        return Integration.findAll();
    }

    findBySlug(slug: string): Promise<Integration> {
        return Integration.findOne({
            where: {
                slug: slug,
            },
        });
    }
}
