import { User } from '@/modules/business/domain/user.entity';
import { UserService } from '@/modules/business/services/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
    constructor(private readonly userService: UserService) {}

    public async getUserByCredentials(
        email: string,
        password: string,
    ): Promise<User | null> {
        const user = await this.userService.findByCredentials(email, password);

        return user;
    }
}
