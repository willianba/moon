# Moon Monorepo

A full-stack monorepo using [moonrepo](https://moonrepo.dev) for task orchestration.

## Stack

- **Runtime**: Bun 1.2+
- **Monorepo**: moonrepo 1.41+
- **Frontend**: SvelteKit + Svelte 5 + Tailwind 4 + DaisyUI 5
- **API**: Hono (mounted in SvelteKit via hooks.server.ts)
- **Database**: PostgreSQL 17 + Drizzle ORM
- **Queue**: Redis 7 + BullMQ
- **Validation**: Zod 3
- **Linting**: Biome + Ultracite

## Structure

```
.moon/                  # Moon configuration
  tasks.yml             # Global tasks (lint, format, typecheck)
  toolchain.yml         # Bun version
  workspace.yml         # Project discovery
apps/
  web/                  # SvelteKit + Hono app
  workers/              # BullMQ workers
packages/
  database/             # Drizzle + PostgreSQL
  shared/               # Zod schemas, types
```

## Commands

### Running Tasks

```bash
# Run a task on a specific project
moon <project>:<task>

# Run a task on all projects
moon :<task>
```

### Development

```bash
# Start web app in dev mode
moon web:dev

# Start workers in dev mode (with --watch)
moon workers:dev
```

### Linting & Formatting

```bash
# Lint + format all projects (with auto-fix)
moon :lint

# Lint for CI (no auto-fix, fails on errors)
moon :lint-ci

# Format only (no linting)
moon :format
```

### Type Checking

```bash
# Type check all projects
moon :typecheck
```

### Building

```bash
# Build the web app
moon web:build

# Preview the production build
moon web:preview

# Start production server
moon web:start
```

### Database

```bash
# Push schema changes to database
moon database:db-push

# Generate migrations
moon database:db-generate

# Run migrations
moon database:db-migrate

# Open Drizzle Studio
moon database:db-studio
```

## Infrastructure

### Start Services

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/moon
REDIS_URL=redis://localhost:6379
```

## Architecture

- Settings dependencies and shared configs stay in the root
- Every config, adapter, lib, db, or reusable code lives in a package
- Every app reuses stuff from packages

Instead of `scripts` in package.json, we use:
- `.moon/tasks.yml` - Global shared tasks (lint, format, typecheck)
- `<project>/moon.yml` - Project-specific tasks and metadata
