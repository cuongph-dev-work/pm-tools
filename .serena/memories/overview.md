Project: pm-tools API
Purpose: Backend API for project management tools (users, projects, sprints, tasks, file storage, invitations, integrations, webhooks).
Tech Stack: Node 22, pnpm, NestJS 11, MikroORM (PostgreSQL), Passport (local+JWT), class-validator/transformer, Swagger, BullMQ (Redis), i18n, Mailer, ServeStatic, Helmet, Compression, Winston logging.
Entrypoint: api/src/main.ts with global prefix /api, versioning via header `version`, Swagger setup via config, global pipes & filters.
Key Modules: auth, user, project, project-invite, sprint, task, file-storage, webhook, integration (Jira), git-alert.
Database: MikroORM entities under api/src/database/entities; migrations & seeds present.
Deployment: PM2 ecosystem config runs `pnpm start:prod`. Docker Compose used for Postgres/Redis/Maildev.
