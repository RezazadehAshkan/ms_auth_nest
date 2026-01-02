import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ICacheService } from '../../application/interfaces/cache.service';

@Injectable()
export class RedisCacheService implements ICacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) { }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.cacheManager.get<T>(key);
        return value || null; // Ensure null is returned if undefined
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        await this.cacheManager.set(key, value, ttl);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }
}
