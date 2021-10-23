import { DomainModel } from '@/modules/business/domain/base/domain.model';
import { Integration } from '@/modules/business/domain/integration';
import { Item } from '@/modules/business/domain/item';

import {
    BelongsTo,
    Column,
    ForeignKey,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

@Table({
    tableName: 'items_integrations',
})
export class ItemIntegration extends DomainModel {
    @Column({
        field: 'external_id',
    })
    externalId: string;

    @PrimaryKey
    @ForeignKey(() => Item)
    @Column({
        field: 'item_id',
    })
    itemId: number;

    @BelongsTo(() => Item)
    item: Item;

    @PrimaryKey
    @ForeignKey(() => Integration)
    @Column({
        field: 'integration_id',
    })
    integrationId: number;

    @BelongsTo(() => Integration)
    integration: Integration;
}
