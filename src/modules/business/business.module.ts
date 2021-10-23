import { IntegrationCategoryService } from '@/modules/business/services/integration-category.service';
import { IntegrationService } from '@/modules/business/services/integration.service';
import { ItemIntegrationService } from '@/modules/business/services/item-integration.service';
import { ItemService } from '@/modules/business/services/item.service';
import { ProjectService } from '@/modules/business/services/project.service';
import { UserService } from '@/modules/business/services/user.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [
        UserService,
        ProjectService,
        ItemService,
        ItemIntegrationService,
        IntegrationService,
        IntegrationCategoryService,
    ],
    exports: [
        UserService,
        ProjectService,
        ItemService,
        ItemIntegrationService,
        IntegrationService,
        IntegrationCategoryService,
    ],
})
export class BusinessModule {}
