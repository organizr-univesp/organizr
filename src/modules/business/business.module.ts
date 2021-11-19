import { AuthenticationService } from '@/modules/business/services/authentication.service';
import { EmailService } from '@/modules/business/services/email.service';
import { IntegrationCategoryService } from '@/modules/business/services/integration-category.service';
import { IntegrationService } from '@/modules/business/services/integration.service';
import { ItemIntegrationService } from '@/modules/business/services/item-integration.service';
import { ItemService } from '@/modules/business/services/item.service';
import { ProjectService } from '@/modules/business/services/project.service';
import { SlugService } from '@/modules/business/services/slug.service';
import { UserService } from '@/modules/business/services/user.service';
import { Logger, Module } from '@nestjs/common';

@Module({
    providers: [
        UserService,
        ProjectService,
        ItemService,
        ItemIntegrationService,
        IntegrationService,
        IntegrationCategoryService,
        AuthenticationService,
        EmailService,
        SlugService,
        Logger,
    ],
    exports: [
        UserService,
        ProjectService,
        ItemService,
        ItemIntegrationService,
        IntegrationService,
        IntegrationCategoryService,
        AuthenticationService,
        EmailService,
        SlugService,
    ],
})
export class BusinessModule {}
