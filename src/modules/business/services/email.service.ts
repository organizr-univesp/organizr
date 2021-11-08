import { Injectable } from '@nestjs/common';
import Client from 'mailgun.js/dist/lib/client';
import Mailgun = require('mailgun.js');
import formData = require('form-data');

const mailgun = new Mailgun(formData);

export interface EmailMessage {
    to: string;
    displayName: string;
    htmlBody: string;
}

@Injectable()
export class EmailService {
    emailClient: Client;

    constructor() {
        this.emailClient = mailgun.client({
            username: 'api',
            key: process.env.MAILGUN_API_KEY,
        });
    }

    async send(message: EmailMessage): Promise<void> {
        await this.emailClient.messages.create(process.env.MAILGUN_DOMAIN, {
            from: 'Suporte <suporte@organizr.com>',
            subject: 'Sua senha foi redefinida',
            to: [`${message.displayName} <${message.to}>`],
            html: message.htmlBody,
        });
    }
}
