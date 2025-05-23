# match-up API

A NestJS-based API for the match-up application.

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (via Docker)
- Redis (via Docker)
- MailDev (via Docker)

## Installation

```bash
# Install dependencies
pnpm install
```

## Docker Setup

The project uses Docker Compose for managing development services. Start the required services:

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Check running services
docker-compose ps
```

### Available Services

- **PostgreSQL**: Running on port 5432
  - Username: postgres
  - Password: postgres
  - Database: s_tour

- **Redis**: Running on port 6379
  - Used for BullMQ job queue

- **MailDev**: Running on ports 1025 (SMTP) and 1080 (Web Interface)
  - Access the web interface at http://localhost:1080
  - Configure your application to use SMTP port 1025 for sending emails

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild services
docker-compose up -d --build

# Remove volumes (will delete all data)
docker-compose down -v
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=qkqDwVzP2a60Tkx
DB_NAME=match-up-dev

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Mail
MAIL_HOST=localhost
MAIL_PORT=1025

# Application
NODE_ENV=development
PORT=3000
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Database Management

### Migrations

The application uses MikroORM for database management. Here are the available migration commands:

```bash
# Create a new migration
pnpm migration:create --name name_migration

# Apply pending migrations
pnpm migration:up

# Revert the last migration
pnpm migration:down

# Show pending migrations
pnpm migration:pending

# Drop all tables and run all migrations from scratch
pnpm migration:fresh
```

### Seeding

To seed the database with initial data:

```bash
# Run the database seeder
pnpm seed:create name_seeder

# Refresh database (drop all tables, run migrations, and seed)
pnpm db:refresh
```

## Project Structure

```
src/
├── configs/           # Configuration files
├── database/         # Database migrations and seeds
│   ├── migrations/   # Database migrations
│   └── seeds/       # Database seeders
├── modules/         # Application modules
└── main.ts         # Application entry point
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the UNLICENSED License.
