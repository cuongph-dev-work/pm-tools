# Logger Architecture

## Tổng quan

Hệ thống logger được thiết kế để tách biệt các loại log khác nhau và tránh lặp code. Sử dụng pattern **Base Class + Factory** để tái sử dụng logic chung.

## Kiến trúc

```
BaseLoggerService (Abstract Base Class)
├── SystemLoggerService (System logs)
├── WebhookLoggerService (Webhook logs)
├── PerformanceLoggerService (Performance logs)
└── LoggerFactory (Factory để tạo logger mới)
```

## Các Logger Types

### 1. System Logger

- **File**: `logs/system-YYYY-MM-DD.log`
- **Color**: Green
- **Label**: `[SYSTEM]`
- **Usage**: Logs chung của hệ thống

### 2. Webhook Logger

- **File**: `logs/webhooks/webhook-YYYY-MM-DD.log`
- **Color**: Magenta
- **Label**: `[WEBHOOK]`
- **Usage**: Logs từ webhook (GitHub, GitLab)

### 3. Performance Logger

- **File**: `logs/performances/performance-YYYY-MM-DD.log`
- **Color**: Blue
- **Label**: `[PERF]`
- **Usage**: Performance metrics, response times

## Cách sử dụng

### Sử dụng Logger có sẵn

```typescript
// Trong service
constructor(
  private readonly systemLogger: SystemLoggerService,
  private readonly webhookLogger: WebhookLoggerService,
  private readonly performanceLogger: PerformanceLoggerService,
) {}

// Sử dụng
this.systemLogger.info('System message');
this.webhookLogger.info('Webhook received');
this.performanceLogger.info('Request processed');
```

### Sử dụng LoggerFactory

```typescript
// Trong service
constructor(
  private readonly loggerFactory: LoggerFactory,
) {}

// Tạo logger mới
const customLogger = this.loggerFactory.createLogger({
  name: 'custom',
  path: 'custom-logs',
  color: chalk.yellow,
  label: 'CUSTOM',
});

// Hoặc sử dụng predefined
const dbLogger = this.loggerFactory.createDatabaseLogger();
const securityLogger = this.loggerFactory.createSecurityLogger();
```

### Tạo Logger Service mới

```typescript
@Injectable()
export class CustomLoggerService extends BaseLoggerService {
  constructor() {
    super();
    this.initInstance({
      name: 'custom',
      path: 'custom',
      color: chalk.yellow,
      label: 'CUSTOM',
    });
  }
}
```

## Lợi ích

1. **Tách biệt logs**: Mỗi loại log có file riêng, dễ quản lý
2. **Tái sử dụng code**: Chỉ cần kế thừa BaseLoggerService
3. **Dễ mở rộng**: Thêm logger mới dễ dàng với LoggerFactory
4. **Consistent format**: Tất cả logs có format thống nhất
5. **Color coding**: Mỗi loại log có màu riêng để dễ phân biệt

## File Structure

```
logs/
├── system-2025-07-31.log
├── webhooks/
│   └── webhook-2025-07-31.log
├── performances/
│   └── performance-2025-07-31.log
└── database/
    └── database-2025-07-31.log
```
