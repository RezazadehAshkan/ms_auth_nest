import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from '../services/redis-cache.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get('REDIS_HOST', 'localhost'),
                port: configService.get('REDIS_PORT', 6379),
                ttl: 600,
            }),
            isGlobal: true,
        }),
    ],
    providers: [
        {
            provide: 'ICacheService',
            useClass: RedisCacheService,
        },
    ],
    exports: [CacheModule, 'ICacheService'],
})
export class CacheInfrastructureModule { }
