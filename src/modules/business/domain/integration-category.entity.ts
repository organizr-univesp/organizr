import { DomainModel } from '@/modules/business/domain/base/domain.model';
import { Column, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
    tableName: 'integration_categories',
})
export class IntegrationCategory extends DomainModel {
    @PrimaryKey
    @Column
    id: string;

    @Column
    name: string;

    @Column
    color: string;
}
