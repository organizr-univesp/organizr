import { User } from '@/modules/business/domain/user.entity';
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { createHash } from 'crypto';

@Injectable()
export class UserService {
    async findByCredentails(email: string, password: string): Promise<User> {
        const passwordHash = createHash('sha512')
            .update(password, 'utf-8')
            .digest('hex');

        return User.findOne({
            where: Sequelize.and(
                {
                    email: email,
                },
                {
                    password_hash: passwordHash,
                },
            ),
        });
    }

    async findAll(): Promise<User[]> {
        return User.findAll();
    }

    async findById(userId: string): Promise<User> {
        return User.findOne({
            where: {
                id: userId,
            },
        });
    }
}
