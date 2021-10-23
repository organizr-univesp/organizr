import { DomainModel } from '@/modules/business/domain/base/domain.model';
import { User } from '@/modules/business/domain/user';
import {
    BelongsTo,
    Column,
    ForeignKey,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

@Table
export class Project extends DomainModel {
    @PrimaryKey
    @Column
    id: string;

    @Column
    name: string;

    @Column
    color: string;

    @Column
    slug: string;

    @ForeignKey(() => User)
    @Column({
        field: 'user_id',
    })
    userId: number;

    @BelongsTo(() => User)
    user: User;
}
