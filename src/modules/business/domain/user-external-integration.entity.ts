import { DomainModel } from '@/modules/business/domain/base/domain.model';
import { User } from '@/modules/business/domain/user.entity';
import {
    BelongsTo,
    Column,
    ForeignKey,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

export enum UserExternalIntegrationType {
    google = 'google',
    trello = 'trello',
}

@Table({ tableName: 'user_external_integrations' })
export class UserExternalIntegration extends DomainModel {
    @PrimaryKey
    @ForeignKey(() => User)
    @Column({
        field: 'user_id',
    })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @PrimaryKey
    @Column
    type: UserExternalIntegrationType;

    @Column
    meta: string;
}
