import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentService {
    public getServerUrl(): string {
        return process.env.SERVER_URL;
    }
}
