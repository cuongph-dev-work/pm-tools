# Suggested Commands

## Development

```bash
# Install dependencies
pnpm install

# Start development server with HMR
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Format code with Prettier
pnpm format

# Check formatting
pnpm format:check

# Run all checks (lint, format, typecheck)
pnpm check-all
```

## Docker

```bash
# Build Docker image
docker build -t my-app .

# Run container
docker run -p 3000:3000 my-app
```

## Git (macOS/Darwin)

```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "message"

# View changes
git diff

# List files
ls -la

# Change directory
cd /path/to/directory

# Search in files
grep -r "pattern" app/

# Find files
find . -name "*.tsx" -type f
```

## Utility Commands

```bash
# Clear cache
rm -rf node_modules .react-router build
pnpm install

# View package info
pnpm list

# Update dependencies
pnpm update
```
