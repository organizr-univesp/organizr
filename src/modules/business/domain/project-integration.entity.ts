import { DomainModel } from '@/modules/business/domain/base/domain.model';
import { Integration } from '@/modules/business/domain/integration.entity';
import { Project } from '@/modules/business/domain/project.entity';

import {
    BelongsTo,
    Column,
    ForeignKey,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

@Table({
    tableName: 'projects_integrations',
})
export class ProjectIntegration extends DomainModel {
    @Column({
        field: 'external_id',
    })
    externalId: string;

    @PrimaryKey
    @ForeignKey(() => Project)
    @Column({
        field: 'project_id',
    })
    projectId: number;

    @BelongsTo(() => Project)
    project: Project;

    @PrimaryKey
    @ForeignKey(() => Integration)
    @Column({
        field: 'integration_id',
    })
    integrationId: number;

    @BelongsTo(() => Integration)
    integration: Integration;
}
