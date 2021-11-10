import { Injectable, Logger } from '@nestjs/common';
import SendGrid = require('@sendgrid/mail');

export interface EmailMessage {
    to: string;
    subject: string;
    displayName: string;
    htmlBody: string;
}

@Injectable()
export class EmailService {
    constructor(private readonly logger: Logger) {
        SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    }

    async send(message: EmailMessage): Promise<void> {
        try {
            await SendGrid.send({
                from: 'Lucas da Organizr <lv201122@gmail.com>',
                subject: message.subject,
                to: [message.to],
                html: message.htmlBody,
            });
        } catch (e) {
            this.logger.error(e);
        }
    }
}
