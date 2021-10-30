import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost): void {
        const httpContext = host.switchToHttp();
        const response = httpContext.getResponse<Response>();
        const statusCode = exception.getStatus();
        const handledStatusCodes = [404, 403];
        const finalStatusCode = handledStatusCodes.includes(statusCode)
            ? statusCode
            : 400;

        response.status(finalStatusCode).redirect(`/error/${finalStatusCode}`);
    }
}
