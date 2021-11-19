import {
    UserExternalIntegration,
    UserExternalIntegrationType,
} from '@/modules/business/domain/user-external-integration.entity';
import { User } from '@/modules/business/domain/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserExternalIntegrationService {
    hasGoogle(externalIntegrations: UserExternalIntegration[]): boolean {
        return externalIntegrations.some(
            (x) => x.type === UserExternalIntegrationType.google,
        );
    }

    hasTrello(externalIntegrations: UserExternalIntegration[]): boolean {
        return externalIntegrations.some(
            (x) => x.type === UserExternalIntegrationType.trello,
        );
    }

    findByUser(user: User): Promise<UserExternalIntegration[]> {
        return UserExternalIntegration.findAll({
            where: {
                user_id: user.id,
            },
        });
    }

    findByUserAndType(
        user: User,
        type: UserExternalIntegrationType,
    ): Promise<UserExternalIntegration> {
        return UserExternalIntegration.findOne({
            where: {
                user_id: user.id,
                type: type,
            },
        });
    }

    create(
        user: User,
        type: UserExternalIntegrationType,
        meta: unknown,
    ): Promise<UserExternalIntegration> {
        return UserExternalIntegration.create({
            userId: user.id,
            type: type,
            meta: meta,
        });
    }
}
