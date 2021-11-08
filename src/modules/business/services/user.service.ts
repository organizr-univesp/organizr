import { UserRole } from '@/modules/business/domain/user-role.entity';
import { v4 } from 'uuid';
import { User } from '@/modules/business/domain/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { createHash } from 'crypto';
import { isEmail } from 'class-validator';
import { EmailService } from '@/modules/business/services/email.service';

@Injectable()
export class UserService {
    constructor(private readonly emailService: EmailService) {}

    static hashPassword(password: string): string {
        return createHash('sha512').update(password, 'utf-8').digest('hex');
    }

    async findByCredentials(email: string, password: string): Promise<User> {
        const passwordHash = UserService.hashPassword(password);

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

    async create(
        fullName: string,
        email: string,
        password: string,
        confirmPassword: string,
    ): Promise<User> {
        if (password == null || confirmPassword == null) {
            throw new BadRequestException(
                'Password and confirm password must be provided.',
            );
        }

        if (password != confirmPassword) {
            throw new BadRequestException(
                "Password and confirm password don't match.",
            );
        }

        if (!isEmail(email)) {
            throw new BadRequestException('Email is not valid.');
        }

        // TODO: Send email to confirm email.
        // This will require adding a new property to the user to hold a
        // "verificationKey" that will be provided in the URL sent via email.
        return await User.create({
            id: v4(),
            email: email,
            passwordHash: UserService.hashPassword(password),
            fullName: fullName,
            role: UserRole.regular,
        });
    }

    async refreshPassword(user: User): Promise<string> {
        const newPassword = v4().substring(0, 8);

        user.passwordHash = UserService.hashPassword(newPassword);
        await user.save();

        return newPassword;
    }

    async sendForgotPasswordEmail(
        user: User,
        newPassword: string,
    ): Promise<void> {
        await this.emailService.send({
            to: user.email,
            displayName: user.fullName,
            htmlBody: `Sua nova senha é: "${newPassword}"`,
        });
    }
}
