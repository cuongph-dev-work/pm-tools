Install deps: pnpm install
Start (dev): pnpm start:dev
Build: pnpm build
Start (prod): pnpm start:prod (PM2 ecosystem supported)
Lint fix: pnpm lint
Lint check: pnpm lint:check
Format write: pnpm format
Format check: pnpm format:check
Test: pnpm test
Test watch: pnpm test:watch
Coverage: pnpm test:cov
E2E: pnpm test:e2e
Migrations: pnpm migration:create --name name_migration | pnpm migration:up | pnpm migration:down | pnpm migration:pending | pnpm migration:fresh
Seeders: pnpm seed:create name_seeder | pnpm seed:run
DB refresh (drop+seed): pnpm db:refresh
Docker compose up: docker-compose up -d | down: docker-compose down | logs: docker-compose logs -f
Run with PM2: pm2 start ecosystem.config.js --env production