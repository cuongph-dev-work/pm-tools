# Cache Usage Examples

## Basic Usage Examples

### 1. User Service with Cache

```typescript
import { Injectable } from '@nestjs/common';
import { Cache, CacheInvalidate } from '@shared/modules/cache/cache.decorator';
import { CacheService } from '@shared/modules/cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cacheService: CacheService,
  ) {}

  // Cache user by ID for 30 minutes
  @Cache('user:{0}', { ttl: 1800 })
  async findUserById(id: string): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  // Cache user by email for 1 hour
  @Cache('user-email:{0}', { ttl: 3600 })
  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  // Cache user list with filters for 15 minutes
  @Cache('users:{0}:{1}:{2}', { ttl: 900 })
  async findUsers(page: number, limit: number, filters: any): Promise<User[]> {
    return this.userRepository.findWithFilters(page, limit, filters);
  }

  // Invalidate user cache when updated
  @CacheInvalidate('user:{0}')
  async updateUser(id: string, data: UpdateUserDto): Promise<void> {
    await this.userRepository.update(id, data);
  }

  // Invalidate multiple cache keys when user is deleted
  @CacheInvalidate('user:{0}')
  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ id });
    await this.userRepository.delete(id);
    
    // Manually invalidate email cache
    await this.cacheService.delete(`user-email:${user.email}`);
  }

  // Manual cache operations
  async getUserWithCustomCache(userId: string): Promise<User> {
    const cacheKey = `custom-user:${userId}`;
    
    // Try to get from cache
    const cached = await this.cacheService.get<User>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const user = await this.userRepository.findOne({ id: userId });
    
    // Cache with custom TTL
    await this.cacheService.set(cacheKey, user, { ttl: 7200 }); // 2 hours
    
    return user;
  }
}
```

### 2. Task Service with Cache

```typescript
import { Injectable } from '@nestjs/common';
import { Cache, CacheInvalidate } from '@shared/modules/cache/cache.decorator';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly cacheService: CacheService,
  ) {}

  // Cache task by ID
  @Cache('task:{0}', { ttl: 1800 })
  async findTaskById(id: string): Promise<Task> {
    return this.taskRepository.findOne({ id });
  }

  // Cache tasks by project with pagination
  @Cache('project-tasks:{0}:{1}:{2}', { ttl: 900 })
  async findTasksByProject(projectId: string, page: number, limit: number): Promise<Task[]> {
    return this.taskRepository.findByProject(projectId, page, limit);
  }

  // Cache task statistics
  @Cache('task-stats:{0}:{1}', { ttl: 1800 })
  async getTaskStats(projectId: string, userId: string): Promise<TaskStats> {
    return this.taskRepository.getStats(projectId, userId);
  }

  // Invalidate task cache when created
  @CacheInvalidate('project-tasks:{0}:*')
  async createTask(projectId: string, data: CreateTaskDto): Promise<Task> {
    const task = await this.taskRepository.create(data);
    
    // Also invalidate stats cache
    await this.cacheService.delete(`task-stats:${projectId}:*`);
    
    return task;
  }

  // Invalidate multiple caches when task is updated
  @CacheInvalidate('task:{0}')
  async updateTask(id: string, data: UpdateTaskDto): Promise<void> {
    const task = await this.taskRepository.findOne({ id });
    await this.taskRepository.update(id, data);
    
    // Invalidate project tasks cache
    await this.cacheService.delete(`project-tasks:${task.project.id}:*`);
    await this.cacheService.delete(`task-stats:${task.project.id}:*`);
  }
}
```

### 3. Dashboard Service with Cache

```typescript
import { Injectable } from '@nestjs/common';
import { Cache } from '@shared/modules/cache/cache.decorator';

@Injectable()
export class DashboardService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // Cache dashboard data for 5 minutes
  @Cache('dashboard:{0}', { ttl: 300 })
  async getDashboardData(userId: string): Promise<DashboardData> {
    const [projects, tasks, users] = await Promise.all([
      this.projectRepository.findByUser(userId),
      this.taskRepository.findByUser(userId),
      this.userRepository.findByProject(userId),
    ]);

    return {
      projects: projects.length,
      tasks: tasks.length,
      users: users.length,
      recentActivity: await this.getRecentActivity(userId),
    };
  }

  // Cache analytics data for 1 hour
  @Cache('analytics:{0}:{1}', { ttl: 3600 })
  async getAnalytics(projectId: string, period: string): Promise<AnalyticsData> {
    return this.calculateAnalytics(projectId, period);
  }

  // Cache report data for 30 minutes
  @Cache('report:{0}:{1}:{2}', { ttl: 1800 })
  async generateReport(projectId: string, type: string, dateRange: string): Promise<ReportData> {
    return this.generateReportData(projectId, type, dateRange);
  }
}
```

## Advanced Usage Examples

### 1. Cache with Conditional Logic

```typescript
@Injectable()
export class AdvancedCacheService {
  constructor(private readonly cacheService: CacheService) {}

  async getDataWithConditionalCache(key: string, forceRefresh = false): Promise<any> {
    if (forceRefresh) {
      // Skip cache and fetch fresh data
      const data = await this.fetchFromDatabase();
      await this.cacheService.set(key, data, { ttl: 3600 });
      return data;
    }

    // Try cache first
    const cached = await this.cacheService.get(key);
    if (cached) {
      return cached;
    }

    // Fetch and cache
    const data = await this.fetchFromDatabase();
    await this.cacheService.set(key, data, { ttl: 3600 });
    return data;
  }

  async getDataWithCacheWarming(key: string): Promise<any> {
    // Check if cache needs warming
    const lastWarmed = await this.cacheService.get(`${key}:last-warmed`);
    const now = Date.now();
    
    if (!lastWarmed || (now - lastWarmed) > 3600000) { // 1 hour
      // Warm the cache
      const data = await this.fetchFromDatabase();
      await this.cacheService.set(key, data, { ttl: 7200 });
      await this.cacheService.set(`${key}:last-warmed`, now, { ttl: 7200 });
      return data;
    }

    // Return from cache
    return this.cacheService.get(key);
  }
}
```

### 2. Cache with Error Handling

```typescript
@Injectable()
export class ResilientCacheService {
  constructor(private readonly cacheService: CacheService) {}

  async getDataWithFallback(key: string): Promise<any> {
    try {
      // Try cache first
      const cached = await this.cacheService.get(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.warn('Cache error, falling back to database:', error);
    }

    try {
      // Fetch from database
      const data = await this.fetchFromDatabase();
      
      // Try to cache (but don't fail if it doesn't work)
      try {
        await this.cacheService.set(key, data, { ttl: 3600 });
      } catch (cacheError) {
        console.warn('Failed to cache data:', cacheError);
      }
      
      return data;
    } catch (error) {
      throw new Error('Failed to fetch data from database');
    }
  }
}
```

### 3. Cache with Batch Operations

```typescript
@Injectable()
export class BatchCacheService {
  constructor(private readonly cacheService: CacheService) {}

  async getMultipleUsers(userIds: string[]): Promise<User[]> {
    const results: User[] = [];
    const missingIds: string[] = [];

    // Try to get all from cache first
    for (const id of userIds) {
      const cached = await this.cacheService.get<User>(`user:${id}`);
      if (cached) {
        results.push(cached);
      } else {
        missingIds.push(id);
      }
    }

    // Fetch missing users from database
    if (missingIds.length > 0) {
      const users = await this.userRepository.findByIds(missingIds);
      
      // Cache the new users
      for (const user of users) {
        await this.cacheService.set(`user:${user.id}`, user, { ttl: 1800 });
        results.push(user);
      }
    }

    return results;
  }

  async invalidateMultipleKeys(keys: string[]): Promise<void> {
    // Invalidate multiple cache keys
    await Promise.all(
      keys.map(key => this.cacheService.delete(key))
    );
  }
}
```

## Cache Monitoring Examples

### 1. Cache Health Check

```typescript
@Injectable()
export class CacheHealthService {
  constructor(private readonly cacheService: CacheService) {}

  async checkCacheHealth(): Promise<HealthStatus> {
    try {
      const isAvailable = await this.cacheService.isAvailable();
      const stats = await this.cacheService.getStats();
      
      return {
        status: isAvailable ? 'healthy' : 'unhealthy',
        cache: {
          available: isAvailable,
          keys: stats.keys,
          memory: stats.memory,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
```

### 2. Cache Performance Monitoring

```typescript
@Injectable()
export class CachePerformanceService {
  private cacheHits = 0;
  private cacheMisses = 0;

  async getDataWithMetrics(key: string): Promise<any> {
    const startTime = Date.now();
    
    try {
      const cached = await this.cacheService.get(key);
      
      if (cached) {
        this.cacheHits++;
        console.log(`Cache HIT for key: ${key} (${Date.now() - startTime}ms)`);
        return cached;
      }
      
      this.cacheMisses++;
      console.log(`Cache MISS for key: ${key}`);
      
      const data = await this.fetchFromDatabase();
      await this.cacheService.set(key, data, { ttl: 3600 });
      
      console.log(`Data fetched and cached for key: ${key} (${Date.now() - startTime}ms)`);
      return data;
    } catch (error) {
      console.error(`Error getting data for key: ${key}:`, error);
      throw error;
    }
  }

  getCacheMetrics() {
    const total = this.cacheHits + this.cacheMisses;
    const hitRate = total > 0 ? (this.cacheHits / total) * 100 : 0;
    
    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      total,
      hitRate: `${hitRate.toFixed(2)}%`,
    };
  }
}
```

## Best Practices Summary

1. **Use descriptive cache keys** with parameters
2. **Set appropriate TTL** based on data volatility
3. **Always invalidate cache** when data changes
4. **Handle cache errors gracefully** with fallbacks
5. **Monitor cache performance** and hit rates
6. **Use cache warming** for frequently accessed data
7. **Implement cache health checks** for monitoring
8. **Consider cache patterns** for complex invalidation scenarios
