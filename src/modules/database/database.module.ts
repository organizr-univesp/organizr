import { Integration } from '@/modules/business/domain/integration.entity';
import { IntegrationCategory } from '@/modules/business/domain/integration-category.entity';
import { Item } from '@/modules/business/domain/item.entity';
import { ItemIntegration } from '@/modules/business/domain/item-integration.entity';
import { Project } from '@/modules/business/domain/project.entity';
import { User } from '@/modules/business/domain/user.entity';
import { DynamicModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserExternalIntegration } from '@/modules/business/domain/user-external-integration.entity';
import { ProjectIntegration } from '@/modules/business/domain/project-integration.entity';

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
                ssl:
                    process.env.NODE_ENV !== 'development'
                        ? {
                              require: true,
                              rejectUnauthorized: false,
                          }
                        : null,
            },
            quoteIdentifiers: false,
            define: {
                timestamps: true,
            },
            models: [
                User,
                Project,
                Item,
                ItemIntegration,
                ProjectIntegration,
                Integration,
                IntegrationCategory,
                UserExternalIntegration,
            ],
        });
    }
}
