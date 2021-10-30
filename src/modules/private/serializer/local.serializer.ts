import { User } from '@/modules/business/domain/user.entity';
import { UserService } from '@/modules/business/services/user.service';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class LocalSerializer extends PassportSerializer {
    constructor(private readonly userService: UserService) {
        super();
    }

    serializeUser(user: User, done: CallableFunction): void {
        done(null, user.id);
    }

    async deserializeUser(
        userId: string,
        done: CallableFunction,
    ): Promise<void> {
        const user = await this.userService.findById(userId);
        done(null, user);
    }
}
