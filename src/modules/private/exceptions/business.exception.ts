import { HttpStatus } from '@nestjs/common';

export class BusinessException {
    constructor(
        readonly code: string,
        readonly message: string,
        readonly target: string,
        readonly details: BusinessException[] = [],
    ) {}

    getStatusCode(): HttpStatus {
        return HttpStatus.BAD_REQUEST;
    }

    toResult(): Record<string, unknown> {
        return {
            code: this.code,
            message: this.message,
            target: this.target,
            details: this.details.map((x) => x.toResult()),
        };
    }
}
