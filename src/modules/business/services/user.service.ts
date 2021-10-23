import { User } from '@/modules/business/domain/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    async findAll(): Promise<User[]> {
        return User.findAll();
    }
}
