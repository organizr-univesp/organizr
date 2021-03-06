import { AuthenticationService } from '@/modules/business/services/authentication.service';
import { EmailService } from '@/modules/business/services/email.service';
import { EnvironmentService } from '@/modules/business/services/environment.service';
import { IntegrationCategoryService } from '@/modules/business/services/integration-category.service';
import { IntegrationService } from '@/modules/business/services/integration.service';
import { ItemIntegrationService } from '@/modules/business/services/item-integration.service';
import { ItemService } from '@/modules/business/services/item.service';
import { ProjectIntegrationService } from '@/modules/business/services/project-integration.service';
import { ProjectService } from '@/modules/business/services/project.service';
import { GoogleAuthService } from '@/modules/business/services/third-party/google/google-auth.service';
import { GoogleCalendarService } from '@/modules/business/services/third-party/google/google-calendar.service';
import { UserExternalIntegrationService } from '@/modules/business/services/user-external-integration.service';
import { SlugService } from '@/modules/business/services/slug.service';
import { UserService } from '@/modules/business/services/user.service';
import { Logger, Module } from '@nestjs/common';
import { CalendarService } from '@/modules/business/services/third-party/calendar.service';
import { TrelloAuthService } from '@/modules/business/services/third-party/trello/trello-auth.service';
import { TrelloService } from '@/modules/business/services/third-party/trello/trello.service';
import { TaskService } from '@/modules/business/services/third-party/task.service';

@Module({
    providers: [
        UserService,
        ProjectService,
        ItemService,
        ItemIntegrationService,
        ProjectIntegrationService,
        IntegrationService,
        IntegrationCategoryService,
        UserExternalIntegrationService,
        AuthenticationService,
        EmailService,
        SlugService,
        EnvironmentService,
        GoogleAuthService,
        GoogleCalendarService,
        CalendarService,
        TrelloAuthService,
        TrelloService,
        TaskService,
        Logger,
    ],
    exports: [
        UserService,
        ProjectService,
        ItemService,
        ItemIntegrationService,
        ProjectIntegrationService,
        IntegrationService,
        IntegrationCategoryService,
        UserExternalIntegrationService,
        AuthenticationService,
        EmailService,
        SlugService,
        EnvironmentService,
        GoogleAuthService,
        GoogleCalendarService,
        CalendarService,
        TrelloAuthService,
        TrelloService,
        TaskService,
    ],
})
export class BusinessModule {}
