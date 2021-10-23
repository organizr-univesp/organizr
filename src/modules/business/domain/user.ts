import { DomainModel } from '@/modules/business/domain/base/domain.model';
import { UserRole } from '@/modules/business/domain/user-role';
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
}
