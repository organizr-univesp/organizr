import { DomainModel } from '@/modules/business/domain/base/domain.model';
import { UserRole } from '@/modules/business/domain/user-role.entity';
import { Column, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class User extends DomainModel {
    @PrimaryKey
    @Column
    id: string;

    @Column
    email: string;

    @Column({
        field: 'password_hash',
    })
    passwordHash: string;

    @Column({
        field: 'full_name',
    })
    fullName: string;

    @Column
    role: UserRole;

    @Column({
        field: 'activation_key',
    })
    activationKey: string;

    @Column({
        field: 'activated_at',
    })
    activatedAt?: Date;
}
