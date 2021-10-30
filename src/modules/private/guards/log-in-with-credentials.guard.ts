import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Injectable()
export class LogInWithCredentialsGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpContext = context.switchToHttp();

        try {
            // Verify the user. This uses Passport's strategies.
            await super.canActivate(context);

            // Sign-in the request
            const request = httpContext.getRequest();
            await super.logIn(request);

            // If no exceptions were thrown, allow the acces
            return true;
        } catch {
            // Redirect user to the sign-in with page
            // mentioning that credentials are wrong.
            const response = httpContext.getResponse<Response>();
            // TODO: Use framework route generation instead of hard-coded routes.
            response.redirect('/authentication/sign-in?wrong-credentials');

            return false;
        }
    }
}
