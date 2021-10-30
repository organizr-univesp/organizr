import { AppModule } from '@/modules/app.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieSession = require('cookie-session');
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';
import * as passport from 'passport';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.setViewEngine('hbs');
    app.useStaticAssets(join(__dirname, '..', 'src/public'));
    app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
    hbsUtils(hbs).registerWatchedPartials(
        join(__dirname, '..', 'src/views/partials'),
    );

    app.use(
        cookieSession({
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            name: 'organizr.session',
            signed: true,
            keys: [process.env.SESSION_SECRET],
            httpOnly: true,
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(process.env.PORT || 3000);
}

bootstrap();
