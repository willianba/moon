# Moon Monorepo

A full-stack Bun monorepo using [moonrepo](https://moonrepo.dev) for task orchestration.

## Stack

- **Runtime**: Bun 1.3+
- **Monorepo**: moonrepo 1.41+
- **Frontend**: SvelteKit + Svelte 5 + Tailwind 4 + DaisyUI 5
- **API**: Hono
- **Database**: PostgreSQL 17 + Drizzle ORM
- **Queue**: Redis 7 + BullMQ
- **Validation**: Zod 4
- **Linting**: Biome + Ultracite

## Prerequisites

- Bun 1.3+
- Moon CLI 1.41+
- Docker Engine with `docker compose`

## Setup

```bash
# install dependencies
bun install

# start local postgres + redis
docker compose up -d

# create local environment file
cp .env.example .env
```

Then configure `.env`:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/moon
REDIS_URL=redis://localhost:6379
PUBLIC_API_URL=http://localhost:5173
```

## Structure

```text
.moon/                  # Moon workspace + shared task configuration
  tasks.yml             # Global lint / format / typecheck tasks
  toolchains.yml        # Bun toolchain configuration
  workspace.yml         # Project discovery
apps/
  web/                  # SvelteKit + Hono app
  workers/              # BullMQ workers
packages/
  database/             # Drizzle + PostgreSQL
  shared/               # Shared schemas, types, utilities
```

## Command model

```bash
# run a task in one project
moon <project>:<task>

# run the same task across all projects
moon :<task>
```

Global shared tasks live in `.moon/tasks.yml`.
Project-specific tasks live in `<project>/moon.yml`.

## Verified commands

These commands were verified from the repo root.

### Quality

```bash
# format all projects
moon :format

# lint with fixes where possible
moon :lint

# CI-style linting
moon :lint-ci

# typecheck all projects
moon :typecheck

# root ultracite wrappers
bun run check
bun run fix
```

### Development

```bash
# start the web app
moon web:dev

# start workers in watch mode
moon workers:dev

# run Svelte checks
moon web:check
```

### Build

```bash
# build the web app
moon web:build

# preview the production build
moon web:preview

# start the production build
moon web:start
```

`moon web:start` requires a valid `.env` file because the shared env schema validates `DATABASE_URL`, `REDIS_URL`, and `PUBLIC_API_URL` at runtime.

`moon web:build` currently completes successfully, but the build prints unresolved Node builtin import warnings coming from server-side dependencies like `postgres`, `ioredis`, and `bullmq`.

### Database

```bash
moon database:db-push
moon database:db-generate
moon database:db-migrate
moon database:db-studio
```

These commands also require `.env` to be present and valid.

## Notes

- There are currently no test files in the repository.
- The pre-commit hook runs `lint-staged` only.
- Root scripts are thin wrappers around Ultracite, while Moon tasks are the main workflow for project commands.
