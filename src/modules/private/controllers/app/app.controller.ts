import { IntegrationCategoryService } from '@/modules/business/services/integration-category.service';
import { IntegrationService } from '@/modules/business/services/integration.service';
import { ItemIntegrationService } from '@/modules/business/services/item-integration.service';
import { ItemService } from '@/modules/business/services/item.service';
import { ProjectService } from '@/modules/business/services/project.service';
import { UserService } from '@/modules/business/services/user.service';
import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
    constructor(
        private readonly userService: UserService,
        private readonly projectService: ProjectService,
        private readonly itemService: ItemService,
        private readonly itemIntegrationService: ItemIntegrationService,
        private readonly integrationService: IntegrationService,
        private readonly integrationCategoryService: IntegrationCategoryService,
    ) {}

    @Get()
    async getHello(): Promise<unknown[]> {
        return this.userService.findAll();
    }
}
