import { Column, Model } from 'sequelize-typescript';

export abstract class DomainModel extends Model {
    @Column({
        field: 'created_at',
    })
    createdAt: Date;

    @Column({
        field: 'updated_at',
    })
    updatedAt?: Date;

    @Column({
        field: 'deleted_at',
    })
    deletedAt?: Date;
}
