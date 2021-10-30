import { Integration } from '@/modules/business/domain/integration.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationService {
    async findAll(): Promise<Integration[]> {
        return Integration.findAll();
    }
}
