import { Integration } from '@/modules/business/domain/integration';
import { IntegrationCategory } from '@/modules/business/domain/integration-category';
import { Item } from '@/modules/business/domain/item';
import { ItemIntegration } from '@/modules/business/domain/item-integration';
import { Project } from '@/modules/business/domain/project';
import { User } from '@/modules/business/domain/user';
import { DynamicModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

export class DatabaseModule extends SequelizeModule {
    static forRoot(): DynamicModule {
        return super.forRoot({
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: (process.env.DB_PORT && Number(process.env.DB_PORT)) || 5432,
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
            quoteIdentifiers: false,
            define: {
                timestamps: false,
            },
            models: [
                User,
                Project,
                Item,
                ItemIntegration,
                Integration,
                IntegrationCategory,
            ],
        });
    }
}
