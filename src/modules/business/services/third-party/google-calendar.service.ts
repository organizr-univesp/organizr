import { GoogleAuthService } from '@/modules/business/services/third-party/google-auth.service';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { calendar_v3, google } from 'googleapis';

@Injectable({ scope: Scope.REQUEST })
export class GoogleCalendarService {
    private calendar?: calendar_v3.Calendar;

    constructor(
        private readonly googleAuthService: GoogleAuthService,
        @Inject(REQUEST) private readonly request: Request,
    ) {}

    async ensureInitialized(): Promise<void> {
        if (!this.calendar) {
            this.calendar = google.calendar({
                version: 'v3',
                auth: await this.googleAuthService.getAuth(this.request.user),
            });
        }
    }

    async getCalendars(): Promise<void> {
        await this.ensureInitialized();
        const result = await this.calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
        });
        // TODO: Continue development
    }
}
