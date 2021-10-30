import { BusinessException } from '@/modules/business/exceptions/business.exception';
import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

const validationErrorCode = 'validationError';

export class ValidationErrorItemException extends BusinessException {
    readonly property: string;
    readonly messages: string[];
    readonly details: ValidationErrorItemException[];

    constructor(validationErrorItem: ValidationError) {
        const validationMessages = Object.values(
            validationErrorItem.constraints,
        );

        super(
            validationErrorCode,
            validationMessages.length === 1
                ? validationMessages[0]
                : `The property ${validationErrorItem.property} failed multiple validations.`,
            validationErrorItem.property,
        );

        this.property = validationErrorItem.property;
        this.messages =
            validationMessages.length === 1 ? [] : validationMessages;
        this.details = validationErrorItem.children.map(
            (x) => new ValidationErrorItemException(x),
        );
    }

    toResult(): Record<string, unknown> {
        return {
            ...super.toResult(),
            messages: this.messages,
        };
    }
}

export class ValidationErrorException extends BusinessException {
    constructor(validationErrors: ValidationError[]) {
        super(
            validationErrorCode,
            "The operation can't proceed because of validation errors.",
            'resource',
            validationErrors.map((x) => new ValidationErrorItemException(x)),
        );
    }

    getStatusCode(): HttpStatus {
        return HttpStatus.UNPROCESSABLE_ENTITY;
    }
}
