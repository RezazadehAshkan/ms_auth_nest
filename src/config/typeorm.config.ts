import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { UserOrmEntity } from '../infrastructure/database/entities/user.orm-entity';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [UserOrmEntity],
    migrations: ['src/infrastructure/database/migrations/*.ts'],
    synchronize: false, // Always false for migrations
});
