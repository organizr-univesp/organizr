import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentService {
    public getAppName(): string {
        return 'Organizr';
    }

    public getServerUrl(): string {
        return process.env.SERVER_URL;
    }
}
