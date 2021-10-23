import { LoggerService } from '@/modules/infrastructure/logger.service';
import { BusinessException } from '@/modules/private/exceptions/business.exception';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(BusinessException)
export class BusinessExceptionFilter
    implements ExceptionFilter<BusinessException>
{
    constructor(private readonly loggerService: LoggerService) {}

    catch(exception: BusinessException, host: ArgumentsHost) {
        const httpContext = host.switchToHttp();
        const response = httpContext.getResponse<Response>();

        // Log the error
        this.loggerService.error(
            exception.message,
            exception.details.map((x) => x.message),
        );

        // Return the response
        response.status(exception.getStatusCode()).json(exception.toResult());
    }
}
