import { UserExternalIntegrationType } from '@/modules/business/domain/user-external-integration.entity';
import { UserExternalIntegrationService } from '@/modules/business/services/user-external-integration.service';
import { User } from '@/modules/business/domain/user.entity';
import { Injectable, Logger, Scope, BadRequestException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

interface CreateResponse {
    id: string;
    name: string;
}

interface BoardIds {
    boardId: string;
    toDoListId: string;
    doneListId: string;
}

type CreateBoardResponse = CreateResponse;
type CreateListResponse = CreateResponse;
type CreateCardResponse = CreateResponse;

@Injectable({ scope: Scope.REQUEST })
export class TrelloService {
    private readonly apiRoot = 'https://api.trello.com/1';
    private readonly apiKey = process.env.TRELLO_API_KEY;

    public static readonly integrationSlug = 'trello';

    private axios?: AxiosInstance;

    constructor(
        private readonly userExternalIntegrationService: UserExternalIntegrationService,
        private readonly logger: Logger,
    ) {}

    static getBoardIds(boardIds: string): BoardIds {
        const idParts = boardIds.split(';');

        if (idParts.length !== 3) {
            throw new BadRequestException(
                'The value provided for `boardIds` is not valid. It must be a semicolon separated string with 3 parts.',
            );
        }

        return {
            boardId: idParts[0],
            doneListId: idParts[1],
            toDoListId: idParts[2],
        };
    }

    async initialize(user: User = null): Promise<void> {
        const externalIntegration =
            await this.userExternalIntegrationService.findByUserAndType(
                user,
                UserExternalIntegrationType.trello,
            );

        if (!externalIntegration) {
            throw new BadRequestException("User didn't connect Trello.");
        }

        const accessTokenParts = await externalIntegration.meta.split(';');

        if (accessTokenParts.length < 2) {
            throw new BadRequestException(
                "User didn't finish connecting with Trello.",
            );
        }

        const accessToken = accessTokenParts[0];

        this.axios = axios.create({
            baseURL: this.apiRoot,
            headers: {
                Authorization: `OAuth oauth_consumer_key="${this.apiKey}", oauth_token="${accessToken}"`,
            },
        });
    }

    ensureInitialized(): void {
        if (!this.axios) {
            throw new Error(
                "The service hasn't been initialized yet.\n\n" +
                    'Invoke `initialize()` before and, optionally, provide an `User` instance.',
            );
        }
    }

    async createBoard(name: string): Promise<string> {
        this.ensureInitialized();

        try {
            const responseBoard = await this.axios.post<CreateBoardResponse>(
                '/boards',
                null,
                {
                    params: {
                        name: name,
                        defaultLists: false,
                    },
                },
            );

            const boardId = responseBoard.data.id;

            // The order of the names here matter
            const listsToCreate = ['Feito', 'Para fazer'];
            const listIds = [];

            for (const name of listsToCreate) {
                const responseList = await this.axios.post<CreateListResponse>(
                    '/lists',
                    null,
                    {
                        params: {
                            idBoard: boardId,
                            name: name,
                        },
                    },
                );

                listIds.push(responseList.data.id);
            }

            return `${boardId};${listIds.join(';')}`;
        } catch (e) {
            this.logger.error(e);
        }
    }

    async createCard(
        boardId: string,
        listId: string,
        name: string,
    ): Promise<string> {
        this.ensureInitialized();

        try {
            const responseCard = await this.axios.post<CreateCardResponse>(
                '/cards',
                null,
                {
                    params: {
                        name: name,
                        idList: listId,
                    },
                },
            );

            return responseCard.data.id;
        } catch (e) {
            this.logger.error(e);
        }
    }

    async moveToList(cardId: string, listId: string) {
        this.ensureInitialized();

        try {
            await this.axios.put(`/cards/${cardId}`, null, {
                params: {
                    idList: listId,
                },
            });
        } catch (e) {
            this.logger.error(e);
        }
    }
}
