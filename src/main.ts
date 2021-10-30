import { AppModule } from '@/modules/app.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieSession = require('cookie-session');
import hbsHelpers = require('handlebars-helpers');
import hbsHelperDate = require('helper-date');
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';
import * as passport from 'passport';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Configure Handlebars & views
    app.setViewEngine('hbs');
    app.useStaticAssets(join(__dirname, '..', 'src/public'));
    app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
    const hbsWithUtils = hbsUtils(hbs);
    hbsWithUtils.registerWatchedPartials(
        join(__dirname, '..', 'src/views/partials'),
    );
    hbsHelpers({
        hbs: hbsWithUtils.hbs,
    });
    hbsWithUtils.hbs.registerHelper('date', hbsHelperDate);

    // Configure session
    app.use(
        cookieSession({
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            name: 'organizr.session',
            signed: true,
            keys: [process.env.SESSION_SECRET],
            httpOnly: true,
        }),
    );

    // Configure authentication
    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(process.env.PORT || 3000);
}

bootstrap();
