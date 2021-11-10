import { EnvironmentService } from '@/modules/business/services/environment.service';
import { UserRole } from '@/modules/business/domain/user-role.entity';
import { v4 } from 'uuid';
import { User } from '@/modules/business/domain/user.entity';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { createHash } from 'crypto';
import { isEmail } from 'class-validator';
import { EmailService } from '@/modules/business/services/email.service';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
    constructor(
        private readonly emailService: EmailService,
        private readonly environmentService: EnvironmentService,
    ) {}

    static hashPassword(password: string): string {
        return createHash('sha512').update(password, 'utf-8').digest('hex');
    }

    async findByCredentials(email: string, password: string): Promise<User> {
        const passwordHash = UserService.hashPassword(password);

        return User.findOne({
            where: Sequelize.and({
                email: email,
                password_hash: passwordHash,
                activated_at: {
                    [Op.ne]: null,
                },
            }),
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

        // TODO: Verify if the email is unique.

        const activationKey = v4();
        await this.emailService.send({
            to: email,
            subject: 'Ative Sua Conta',
            htmlBody: `<a href="${this.environmentService.getServerUrl()}/authentication/activate/${activationKey}">Confirme seu e-mail</a>.`,
            displayName: fullName,
        });

        return await User.create({
            id: v4(),
            email: email,
            passwordHash: UserService.hashPassword(password),
            fullName: fullName,
            role: UserRole.regular,
            activationKey: activationKey,
            activatedAt: undefined,
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
            subject: 'Redefinição de Senha',
            htmlBody: `Sua nova senha é: "${newPassword}"`,
        });
    }

    async activateByKey(key: string): Promise<User> {
        const user = await User.findOne({
            where: {
                activation_key: key,
            },
        });

        if (user == null) {
            throw new NotFoundException('User not found.');
        }

        if (user.activatedAt != null) {
            throw new BadRequestException('User is already activated.');
        }

        user.activatedAt = new Date();
        await user.save();

        return user;
    }
}
