import { UserExternalIntegrationType } from '@/modules/business/domain/user-external-integration.entity';
import { User } from '@/modules/business/domain/user.entity';
import { UserExternalIntegrationService } from '@/modules/business/services/user-external-integration.service';
import { UserService } from '@/modules/business/services/user.service';
import { ForbiddenException, Injectable, Scope } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

@Injectable({ scope: Scope.REQUEST })
export class GoogleAuthService {
    private readonly client: OAuth2Client;

    constructor(
        private readonly userService: UserService,
        private readonly userExternalIntegrationService: UserExternalIntegrationService,
    ) {
        this.client = new google.auth.OAuth2({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri: process.env.GOOGLE_REDIRECT_URI,
        });
    }

    generateAuthUrl(user: User): string {
        return this.client.generateAuthUrl({
            // Offline allows us to get a refresh token to have indefinite access
            // to the user's resources.
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/calendar.events',
            ],
            state: user.id,
        });
    }

    async validateCode(code: string, userId: string): Promise<void> {
        const token = await this.client.getToken(code);

        if (!token.tokens.refresh_token) {
            throw new ForbiddenException('Refresh token was not provided.');
        }

        this.client.setCredentials(token.tokens);

        const user = await this.userService.findById(userId);

        if (user == null) {
            throw new ForbiddenException();
        }

        let externalIntegration =
            await this.userExternalIntegrationService.findByUserAndType(
                user,
                UserExternalIntegrationType.google,
            );

        if (externalIntegration == null) {
            externalIntegration =
                await this.userExternalIntegrationService.create(
                    user,
                    UserExternalIntegrationType.google,
                    token.tokens.refresh_token,
                );
        }

        await externalIntegration.save();
    }

    async getAuth(user?: Express.User): Promise<OAuth2Client> {
        if (!user) {
            throw new ForbiddenException('User provided is not available.');
        }

        const externalIntegration =
            await this.userExternalIntegrationService.findByUserAndType(
                user as User,
                UserExternalIntegrationType.google,
            );

        if (externalIntegration == null) {
            throw new ForbiddenException(
                'User did not add integration for this service.',
            );
        }

        this.client.setCredentials({
            refresh_token: externalIntegration.meta,
        });

        this.client.on('tokens', async (tokens) => {
            const externalIntegration =
                await this.userExternalIntegrationService.findByUserAndType(
                    user as User,
                    UserExternalIntegrationType.google,
                );

            if (externalIntegration == null) {
                // This user is not connected anymore.
                return;
            }

            externalIntegration.meta = tokens.refresh_token;
            await externalIntegration.save();
        });

        return this.client;
    }
}
