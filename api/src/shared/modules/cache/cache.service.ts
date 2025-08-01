import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

export interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly defaultTTL = 3600; // 1 hour
  private readonly defaultPrefix = 'mikroorm:';

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * Get value from cache
   */
  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    try {
      const fullKey = this.buildKey(key, options?.prefix);
      const value = await this.cacheManager.get<T>(fullKey);
      return value || null;
    } catch (error) {
      this.logger.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    try {
      const fullKey = this.buildKey(key, options?.prefix);
      const ttl = options?.ttl || this.defaultTTL;
      await this.cacheManager.set(fullKey, value, ttl);
    } catch (error) {
      this.logger.error(`Error setting cache key ${key}:`, error);
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string, options?: CacheOptions): Promise<void> {
    try {
      const fullKey = this.buildKey(key, options?.prefix);
      await this.cacheManager.del(fullKey);
    } catch (error) {
      this.logger.error(`Error deleting cache key ${key}:`, error);
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    try {
      await this.cacheManager.reset();
      this.logger.log('Cache cleared successfully');
    } catch (error) {
      this.logger.error('Error clearing cache:', error);
    }
  }

  /**
   * Get cache statistics (basic implementation)
   */
  async getStats(): Promise<{ keys: number; memory: string }> {
    try {
      // Note: cache-manager doesn't provide direct statistics
      // This is a placeholder for future implementation
      return { keys: 0, memory: 'unknown' };
    } catch (error) {
      this.logger.error('Error getting cache stats:', error);
      return { keys: 0, memory: 'unknown' };
    }
  }

  /**
   * Check if cache is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Try to set and get a test value
      const testKey = 'test:availability';
      const testValue = 'test';
      await this.cacheManager.set(testKey, testValue, 1);
      const result = await this.cacheManager.get(testKey);
      return result === testValue;
    } catch (error) {
      this.logger.error('Cache not available:', error);
      return false;
    }
  }

  /**
   * Build cache key with prefix
   */
  private buildKey(key: string, prefix?: string): string {
    const keyPrefix = prefix || this.defaultPrefix;
    return `${keyPrefix}${key}`;
  }

  /**
   * Get the underlying cache manager for advanced operations
   */
  getCacheManager(): Cache {
    return this.cacheManager;
  }
}
