import { UserExternalIntegrationType } from '@/modules/business/domain/user-external-integration.entity';
import { User } from '@/modules/business/domain/user.entity';
import { EnvironmentService } from '@/modules/business/services/environment.service';
import { UserExternalIntegrationService } from '@/modules/business/services/user-external-integration.service';
import { UserService } from '@/modules/business/services/user.service';
import { BadRequestException, Injectable, Scope, Logger } from '@nestjs/common';
import { OAuth } from 'oauth';

type AuthRequestData = {
    token: string;
    tokenSecret: string;
};

type AuthSuccessData = {
    accessToken: string;
    accessTokenSecret: string;
};

@Injectable({ scope: Scope.REQUEST })
export class TrelloAuthService {
    private readonly apiKey = process.env.TRELLO_API_KEY;
    private readonly apiSecret = process.env.TRELLO_API_SECRET;

    constructor(
        private readonly environmentService: EnvironmentService,
        private readonly userService: UserService,
        private readonly userExternalIntegrationService: UserExternalIntegrationService,
        private readonly logger: Logger,
    ) {}

    buildOAuth(user: User): OAuth {
        // More information: https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/#using-basic-oauth
        return new OAuth(
            'https://trello.com/1/OAuthGetRequestToken',
            'https://trello.com/1/OAuthGetAccessToken',
            this.apiKey,
            this.apiSecret,
            '1.0A',
            `${this.environmentService.getServerUrl()}/integrations/trello/callback?user_id=${
                user.id
            }`,
            'HMAC-SHA1',
        );
    }

    async generateAuthUrl(user: User): Promise<string> {
        const oauth = this.buildOAuth(user);

        const authData = await new Promise<AuthRequestData>((resolve) => {
            oauth.getOAuthRequestToken((error, token, tokenSecret) => {
                if (error) {
                    this.logger.error(error);

                    throw new BadRequestException(
                        'Trello authentication failed.',
                    );
                }

                resolve({
                    token,
                    tokenSecret,
                });
            });
        });

        await this.userExternalIntegrationService.deleteByUserAndType(
            user,
            UserExternalIntegrationType.trello,
        );

        // Store only the token secret for now, because it'll be changed later
        // to store other tokens necessary to act on user's behalf.
        await this.userExternalIntegrationService.create(
            user,
            UserExternalIntegrationType.trello,
            authData.tokenSecret,
        );

        const urlParams = new URLSearchParams();
        const authUrl = `https://trello.com/1/OAuthAuthorizeToken`;
        urlParams.set('oauth_token', authData.token);
        urlParams.set('name', this.environmentService.getAppName());
        urlParams.set('scope', 'read,write');
        urlParams.set('expiration', 'never');
        urlParams.set('user_id', user.id);

        return `${authUrl}?${urlParams}`;
    }

    async validateToken(
        token: string,
        verifier: string,
        userId: string,
    ): Promise<void> {
        const user = await this.userService.findById(userId);

        if (!user) {
            throw new BadRequestException('User not found.');
        }

        const externalIntegration =
            await this.userExternalIntegrationService.findByUserAndType(
                user,
                UserExternalIntegrationType.trello,
            );

        if (!externalIntegration) {
            throw new BadRequestException(
                "User didn't start the authentication flow with Trello yet.",
            );
        }

        const oauth = this.buildOAuth(user);
        // At this point, the `meta` value should be the token secret./
        const tokenSecret = externalIntegration.meta;

        const authData = await new Promise<AuthSuccessData>((resolve) => {
            oauth.getOAuthAccessToken(
                token,
                tokenSecret,
                verifier,
                (error, accessToken, accessTokenSecret, results) => {
                    resolve({
                        accessToken,
                        accessTokenSecret,
                    });
                },
            );
        });

        externalIntegration.meta = `${authData.accessToken};${authData.accessTokenSecret}`;
        await externalIntegration.save();
    }
}
