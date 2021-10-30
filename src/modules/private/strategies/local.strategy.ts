import { User } from '@/modules/business/domain/user.entity';
import { AuthenticationService } from '@/modules/business/services/authentication.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authenticationService: AuthenticationService) {
        super({
            usernameField: 'email',
        });
    }

    async validate(email: string, password: string): Promise<User> {
        return this.authenticationService.getUserByCredentials(email, password);
    }
}
