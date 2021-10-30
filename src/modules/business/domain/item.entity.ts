import { DomainModel } from '@/modules/business/domain/base/domain.model';
import { Project } from '@/modules/business/domain/project.entity';
import {
    BelongsTo,
    Column,
    ForeignKey,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

@Table
export class Item extends DomainModel {
    @PrimaryKey
    @Column
    id: string;

    @Column
    name: string;

    @ForeignKey(() => Project)
    @Column({
        field: 'project_id',
    })
    projectId: number;

    @BelongsTo(() => Project)
    project: Project;

    @Column
    slug: string;
}
