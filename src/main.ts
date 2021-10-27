import { AppModule } from '@/modules/app.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.setViewEngine('hbs');
    app.useStaticAssets(join(__dirname, '..', 'src/public'));
    app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
    hbsUtils(hbs).registerWatchedPartials(
        join(__dirname, '..', 'src/views/partials'),
    );
    // hbs.registerPartials(join(__dirname, '..', 'src/views/partials'));

    await app.listen(process.env.PORT || 3000);
}
bootstrap();
