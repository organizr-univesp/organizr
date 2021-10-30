import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class PublicOnlyMiddleware implements NestMiddleware {
    use(request: Request, response: Response, next: () => void) {
        if (request.isAuthenticated()) {
            response.redirect('/app');
        } else {
            next();
        }
    }
}
