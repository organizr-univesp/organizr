import { ItemIntegrationService } from './../item-integration.service';
import { ProjectIntegrationService } from '@/modules/business/services/project-integration.service';
import { IntegrationService } from '@/modules/business/services/integration.service';
import { UserExternalIntegrationService } from '@/modules/business/services/user-external-integration.service';
import { Project } from '@/modules/business/domain/project.entity';
import { Injectable } from '@nestjs/common';
import { TrelloService } from '@/modules/business/services/third-party/trello/trello.service';
import { Item } from '@/modules/business/domain/item.entity';

@Injectable()
export class TaskService {
    constructor(
        private readonly integrationService: IntegrationService,
        private readonly userExternalIntegrationService: UserExternalIntegrationService,
        private readonly projectIntegrationService: ProjectIntegrationService,
        private readonly itemIntegrationService: ItemIntegrationService,
        private readonly trelloService: TrelloService,
    ) {}

    async createBoard(
        project: Project,
        name: string,
        color: string,
    ): Promise<void> {
        const user = project.user;
        const externalIntegrations =
            await this.userExternalIntegrationService.findByUser(user);

        if (
            this.userExternalIntegrationService.hasTrello(externalIntegrations)
        ) {
            const integration = await this.integrationService.findBySlug(
                TrelloService.integrationSlug,
            );

            if (!integration) {
                // Integration no more exists or is disabled.
                return;
            }

            // Initialize Trello integration
            await this.trelloService.initialize(user);

            // Create the board
            const boardIds = await this.trelloService.createBoard(name);

            // Save the ID of the board to the database
            await this.projectIntegrationService.create(
                project,
                integration,
                boardIds,
            );
        }
    }

    async createTask(item: Item, name: string): Promise<void> {
        const project = item.project;
        const user = project.user;
        const externalIntegrations =
            await this.userExternalIntegrationService.findByUser(user);
        const projectIntegrations =
            await this.projectIntegrationService.findByProject(project);

        if (
            this.userExternalIntegrationService.hasTrello(externalIntegrations)
        ) {
            const integration = await this.integrationService.findBySlug(
                TrelloService.integrationSlug,
            );

            if (!integration) {
                // Integration no more exists or is disabled.
                return;
            }

            // Get the Trello integration for this project
            const trelloIntegration =
                ProjectIntegrationService.tryGetTrello(projectIntegrations);

            // If it exists
            if (trelloIntegration) {
                // Initialize Trello integration
                await this.trelloService.initialize(user);

                const boardIds = TrelloService.getBoardIds(
                    trelloIntegration.externalId,
                );

                // Create the card
                const cardId = await this.trelloService.createCard(
                    boardIds.boardId,
                    boardIds.toDoListId,
                    name,
                );

                // Save the ID of the card to the database
                await this.itemIntegrationService.create(
                    item,
                    integration,
                    cardId,
                );
            }
        }
    }

    async updateStatus(item: Item, finished: boolean): Promise<void> {
        const project = item.project;
        const user = project.user;
        const externalIntegrations =
            await this.userExternalIntegrationService.findByUser(user);
        const projectIntegrations =
            await this.projectIntegrationService.findByProject(project);
        const itemIntegrations = await this.itemIntegrationService.findByItem(
            item,
        );

        if (
            this.userExternalIntegrationService.hasTrello(externalIntegrations)
        ) {
            const integration = await this.integrationService.findBySlug(
                TrelloService.integrationSlug,
            );

            if (!integration) {
                // Integration no more exists or is disabled.
                return;
            }

            // Get the Trello integration for this project
            const itemTrelloIntegration =
                ItemIntegrationService.tryGetTrello(itemIntegrations);
            const projectTrelloIntegration =
                ProjectIntegrationService.tryGetTrello(projectIntegrations);

            // If it exists
            if (itemTrelloIntegration) {
                // Initialize Trello integration
                await this.trelloService.initialize(user);

                const boardIds = TrelloService.getBoardIds(
                    projectTrelloIntegration.externalId,
                );

                const cardId = itemTrelloIntegration.externalId;
                const listId = finished
                    ? boardIds.doneListId
                    : boardIds.toDoListId;

                // Create the card
                await this.trelloService.moveToList(cardId, listId);
            }
        }
    }
}
