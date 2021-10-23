import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
    error(message: string, details: string[]): void {
        console.error(message, details);
    }

    info(message: string, details: string[]): void {
        console.info(message, details);
    }

    warn(message: string, details: string[]): void {
        console.warn(message, details);
    }
}
