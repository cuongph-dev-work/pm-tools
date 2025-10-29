Prereqs: Node 22.14+, pnpm >=10.7, Docker (Postgres, Redis, MailDev).
Env: .env with DB_*, REDIS_*, MAIL_*, NODE_ENV, PORT.
Dev: pnpm install && pnpm start:dev
Build: pnpm build (SWC) → outputs to api/dist
Prod: pnpm start:prod or pm2 start ecosystem.config.js
Docs: Swagger mounted in app (configSwagger). Global prefix /api.
Infra: docker-compose up -d (Postgres 5432, Redis 6379, MailDev 1025/1080)
Migrations/Seed: pnpm migration:* and seed:* (MikroORM config at src/configs/mikro-orm.config.ts)