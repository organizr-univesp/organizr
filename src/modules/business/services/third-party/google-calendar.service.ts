import { User } from '@/modules/business/domain/user.entity';
import { GoogleAuthService } from '@/modules/business/services/third-party/google-auth.service';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { calendar_v3, google } from 'googleapis';

@Injectable({ scope: Scope.REQUEST })
export class GoogleCalendarService {
    static readonly integrationSlug = 'google-calendar';

    private calendar?: calendar_v3.Calendar;

    constructor(
        private readonly googleAuthService: GoogleAuthService,
        private readonly logger: Logger,
        @Inject(REQUEST) private readonly request: Request,
    ) {}

    async initialize(user: User = null): Promise<void> {
        if (!this.calendar) {
            this.calendar = google.calendar({
                version: 'v3',
                auth: await this.googleAuthService.getAuth(
                    user ?? this.request.user,
                ),
            });
        }
    }

    ensureInitialized(): void {
        if (!this.calendar) {
            throw new Error(
                "The service hasn't been initialized yet.\n\n" +
                    '`Invoke `initialize()` before and, optionally, provide an `User` instance.',
            );
        }
    }

    async createCalendar(name: string): Promise<string> {
        this.ensureInitialized();

        try {
            const result = await this.calendar.calendars.insert({
                requestBody: {
                    summary: name,
                },
            });

            return result.data.id;
        } catch (e) {
            this.logger.error(e);
        }
    }

    async createEvent(
        calendarId: string,
        name: string,
        start: Date,
        end: Date,
    ): Promise<string> {
        this.ensureInitialized();

        try {
            const result = await this.calendar.events.insert({
                calendarId: calendarId,
                requestBody: {
                    summary: name,
                    start: {
                        dateTime: start.toISOString(),
                    },
                    end: {
                        dateTime: end.toISOString(),
                    },
                },
            });

            return result.data.id;
        } catch (e) {
            this.logger.error(e);
        }
    }
}
