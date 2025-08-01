# Level 2 Cache Implementation with @nestjs/cache-manager

## Overview

This document describes the Level 2 Cache (L2 Cache) implementation for the PM Tools API using **@nestjs/cache-manager** with Redis store.

## Features

### 1. MikroORM Built-in Cache

- **Result Cache**: Caches query results for better performance
- **Metadata Cache**: Caches entity metadata to reduce startup time
- **Configurable TTL**: Customizable cache expiration times

### 2. @nestjs/cache-manager Integration

- **Official NestJS cache solution** with Redis store
- **Automatic connection management** with error handling
- **Configurable key prefixes** for organization
- **Built-in decorators** for easy caching
- **Type-safe cache operations**

### 3. Custom Cache Decorators

- **@Cache**: Automatically cache method results
- **@CacheInvalidate**: Automatically invalidate cache on data changes
- **Parameter substitution** in cache keys
- **Configurable TTL per method**

## Configuration

### Environment Variables

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0

# Cache Configuration
CACHE_ENABLED=true
CACHE_TTL=3600
CACHE_MAX_ITEMS=1000
METADATA_CACHE_ENABLED=true
METADATA_CACHE_TTL=86400
```

### Dependencies

```json
{
  "dependencies": {
    "@nestjs/cache-manager": "^2.1.1",
    "cache-manager": "^5.4.0",
    "cache-manager-ioredis-yet": "^2.1.2",
    "ioredis": "^5.3.2"
  }
}
```

### MikroORM Configuration

The cache is configured in `src/configs/mikro-orm.config.ts`:

```typescript
export const baseConfig: Options = {
  // ... other config
  resultCache: {
    expiration: parseInt(process.env.CACHE_TTL || '3600'), // 1 hour default
    global: process.env.CACHE_ENABLED === 'true',
  },
  metadataCache: {
    enabled: process.env.METADATA_CACHE_ENABLED !== 'false',
  },
};
```

### Cache Module Configuration

The cache module is configured in `src/shared/modules/cache/cache.module.ts`:

```typescript
@Module({
  imports: [
    ConfigModule,
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
        password: configService.get<string>('REDIS_PASSWORD'),
        db: configService.get<number>('REDIS_DB', 0),
        ttl: configService.get<number>('CACHE_TTL', 3600),
        max: configService.get<number>('CACHE_MAX_ITEMS', 1000),
        keyPrefix: 'mikroorm:',
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [NestCacheModule, CacheService],
})
export class CacheModule {}
```

## Usage

### 1. Using Cache Decorators

#### Basic Caching

```typescript
import { Cache } from '@shared/modules/cache/cache.decorator';

@Cache('user:{0}', { ttl: 1800 }) // Cache for 30 minutes
async findUserById(id: string): Promise<User> {
  return this.userRepository.findOne({ id });
}
```

#### Cache Invalidation

```typescript
import { CacheInvalidate } from '@shared/modules/cache/cache.decorator';

@CacheInvalidate('user:{0}') // Invalidate user cache when updated
async updateUser(id: string, data: UpdateUserDto): Promise<void> {
  // Update logic here
}
```

#### Multiple Parameters

```typescript
@Cache('project-stats:{0}:{1}', { ttl: 900 }) // Cache for 15 minutes
async getProjectStats(projectId: string, userId: string): Promise<ProjectStats> {
  // Method logic here
}
```

### 2. Using Cache Service Directly

```typescript
import { CacheService } from '@shared/modules/cache/cache.service';

constructor(private readonly cacheService: CacheService) {}

async getData(key: string): Promise<any> {
  // Try to get from cache first
  const cached = await this.cacheService.get(key);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const data = await this.fetchFromDatabase();
  
  // Store in cache
  await this.cacheService.set(key, data, { ttl: 3600 });
  
  return data;
}
```

### 3. Using @nestjs/cache-manager Directly

```typescript
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

async getData(key: string): Promise<any> {
  // Get from cache
  const cached = await this.cacheManager.get(key);
  if (cached) {
    return cached;
  }

  // Fetch and cache
  const data = await this.fetchFromDatabase();
  await this.cacheManager.set(key, data, 3600);
  
  return data;
}
```

### 4. Cache Service Methods

```typescript
// Get value from cache
const value = await cacheService.get('key');

// Set value in cache
await cacheService.set('key', value, { ttl: 3600 });

// Delete value from cache
await cacheService.delete('key');

// Clear all cache entries
await cacheService.clear();

// Check if cache is available
const isAvailable = await cacheService.isAvailable();

// Get cache statistics
const stats = await cacheService.getStats();
```

## Best Practices

### 1. Cache Key Design

- Use descriptive, unique keys
- Include relevant parameters in keys
- Use consistent naming conventions
- Consider using prefixes for organization

### 2. TTL Configuration

- Set appropriate TTL based on data volatility
- Use shorter TTL for frequently changing data
- Use longer TTL for static data
- Consider business requirements for data freshness

### 3. Cache Invalidation

- Always invalidate cache when data is modified
- Use specific keys for invalidation
- Consider cache warming strategies
- Monitor cache hit rates

### 4. Error Handling

- Cache failures should not break application
- Implement fallback mechanisms
- Log cache errors for monitoring
- Consider circuit breaker patterns

## Monitoring

### Cache Statistics

```typescript
const stats = await cacheService.getStats();
console.log(`Cache Keys: ${stats.keys}`);
console.log(`Memory Usage: ${stats.memory}`);
```

### Redis CLI Commands

```bash
# Check Redis info
redis-cli info memory

# Monitor cache keys
redis-cli keys "mikroorm:*"

# Check cache size
redis-cli dbsize
```

## Performance Considerations

### 1. Memory Usage

- Monitor Redis memory usage
- Set appropriate maxmemory policy
- Consider data serialization overhead
- Implement cache eviction strategies

### 2. Network Latency

- Use Redis connection pooling
- Consider Redis clustering for high availability
- Monitor Redis connection health
- Implement retry mechanisms

### 3. Cache Hit Rate

- Monitor cache hit/miss ratios
- Optimize cache keys and TTL
- Consider cache warming strategies
- Analyze cache patterns

## Troubleshooting

### Common Issues

1. **Cache Not Working**
   - Check Redis connection
   - Verify environment variables
   - Check cache service availability

2. **High Memory Usage**
   - Monitor cache TTL settings
   - Implement cache eviction
   - Consider data serialization

3. **Cache Inconsistency**
   - Verify cache invalidation logic
   - Check cache key patterns
   - Monitor cache update timing

### Debug Commands

```typescript
// Check cache availability
const isAvailable = await cacheService.isAvailable();

// Get cache statistics
const stats = await cacheService.getStats();

// Clear all cache
await cacheService.clear();
```

## Migration Guide

### From Custom Cache to @nestjs/cache-manager

1. **Install dependencies**

   ```bash
   pnpm add @nestjs/cache-manager cache-manager cache-manager-ioredis-yet
   ```

2. **Configure environment variables**

   ```env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   CACHE_ENABLED=true
   ```

3. **Import CacheModule in your modules**

   ```typescript
   imports: [SharedModule] // SharedModule includes CacheModule
   ```

4. **Add cache service to your services**

   ```typescript
   constructor(private readonly cacheService: CacheService) {}
   ```

5. **Add cache decorators to methods**

   ```typescript
   @Cache('key:{0}', { ttl: 3600 })
   async method(id: string) {
     // Method logic
   }
   ```

## Advantages of @nestjs/cache-manager

1. **Official NestJS Solution**: Built specifically for NestJS applications
2. **Type Safety**: Full TypeScript support with proper typing
3. **Multiple Stores**: Support for Redis, Memory, and other stores
4. **Built-in Decorators**: Easy to use caching decorators
5. **Performance**: Optimized for NestJS dependency injection
6. **Maintenance**: Actively maintained by the NestJS team
7. **Community**: Large community and good documentation

## Future Enhancements

1. **Cache Warming**: Implement strategies to pre-populate cache
2. **Cache Analytics**: Add detailed cache performance metrics
3. **Distributed Cache**: Support for Redis cluster
4. **Cache Compression**: Implement data compression for large objects
5. **Cache Patterns**: Add more sophisticated cache invalidation patterns
6. **Health Checks**: Add cache health check endpoints
