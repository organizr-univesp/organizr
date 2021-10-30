import { DomainModel } from '@/modules/business/domain/base/domain.model';
import { IntegrationCategory } from '@/modules/business/domain/integration-category.entity';
import {
    BelongsTo,
    Column,
    ForeignKey,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

@Table
export class Integration extends DomainModel {
    @PrimaryKey
    @Column
    id: string;

    @Column
    name: string;

    @Column({
        field: 'thumbnail_url',
    })
    thumbnailUrl: string;

    @Column
    color: string;

    @Column
    slug: string;

    @ForeignKey(() => IntegrationCategory)
    @Column({
        field: 'integration_category_id',
    })
    integrationCategoryId: number;

    @BelongsTo(() => IntegrationCategory)
    integrationCategory: IntegrationCategory;
}
