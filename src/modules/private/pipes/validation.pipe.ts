import { ValidationErrorException } from '@/modules/business/exceptions/validation.error.exception';
import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    Type,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
    async transform(
        value: unknown,
        metadata: ArgumentMetadata,
    ): Promise<unknown> {
        if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
            return value;
        }

        const object = plainToClass(metadata.metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            throw new ValidationErrorException(errors);
        }

        return value;
    }

    private toValidate(metatype: Type<unknown>): boolean {
        const types: Type<unknown>[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
