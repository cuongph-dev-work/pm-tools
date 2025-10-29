Language: TypeScript (strict, NestJS style).
Naming: Descriptive names; controllers expose REST endpoints with decorators; services contain business logic; repositories via MikroORM.
Types: DTOs validated with class-validator; transformers enabled; avoid any.
Controllers: Use @Controller, method decorators (@Get, @Post, etc.), guards (@UseGuards), roles via @Roles and custom guard.
Auth: Passport strategies (local, jwt); guards per route; decorators @CurrentUser and @Public.
Config: ConfigService; settings under src/configs.
Code Quality: ESLint + Prettier scripts; run lint:check and format:check in CI.
Error Handling: Global HttpExceptionFilter; validation errors mapped via ValidationErrorFactory.
Versioning: Header `version`, default '1'.
Swagger: Configured via configSwagger.
