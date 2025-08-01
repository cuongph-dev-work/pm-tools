import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

export interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

/**
 * Cache decorator for method results using @nestjs/cache-manager
 * @param key - Cache key (can include placeholders like {0}, {1} for method parameters)
 * @param options - Cache options
 */
export function Cache(key: string, options?: CacheOptions) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Get cache manager from the instance
      const cacheManager = (this as any).cacheManager as Cache;

      if (!cacheManager) {
        // If no cache manager available, just execute the method
        return method.apply(this, args);
      }

      // Build cache key with parameter substitution
      let cacheKey = key;
      args.forEach((arg, index) => {
        cacheKey = cacheKey.replace(`{${index}}`, String(arg));
      });

      // Add method name and class name to make key unique
      cacheKey = `${target.constructor.name}:${propertyName}:${cacheKey}`;

      // Try to get from cache first
      const cachedResult = await cacheManager.get(cacheKey);
      if (cachedResult !== undefined && cachedResult !== null) {
        return cachedResult;
      }

      // Execute method and cache result
      const result = await method.apply(this, args);
      await cacheManager.set(cacheKey, result, options?.ttl);

      return result;
    };

    return descriptor;
  };
}

/**
 * Cache invalidation decorator using @nestjs/cache-manager
 * @param pattern - Cache key pattern to invalidate (supports wildcards)
 * @param options - Cache options
 */
export function CacheInvalidate(pattern: string, _options?: CacheOptions) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Execute the method first
      const result = await method.apply(this, args);

      // Get cache manager from the instance
      const cacheManager = (this as any).cacheManager as Cache;

      if (cacheManager) {
        // Build cache key pattern with parameter substitution
        let cachePattern = pattern;
        args.forEach((arg, index) => {
          cachePattern = cachePattern.replace(`{${index}}`, String(arg));
        });

        // Add method name and class name to make pattern unique
        cachePattern = `${target.constructor.name}:${propertyName}:${cachePattern}`;

        // For cache-manager, we need to clear specific keys
        // Since cache-manager doesn't support pattern-based deletion directly,
        // we'll use a simple approach by deleting the specific key
        await cacheManager.del(cachePattern);
      }

      return result;
    };

    return descriptor;
  };
}

/**
 * Inject cache manager decorator for manual cache operations
 */
export const InjectCache = () => Inject(CACHE_MANAGER);
