# Moon Monorepo

A full-stack Bun monorepo using [moonrepo](https://moonrepo.dev) for task orchestration.

## Stack

- **Runtime**: Bun 1.3+
- **Monorepo**: moonrepo 1.41+
- **Web app**: SvelteKit + Svelte 5 + Tailwind 4 + DaisyUI 5
- **Database**: SQLite / Turso (libSQL) + Drizzle ORM
- **Queue**: Redis 7 + BullMQ
- **Validation**: Zod 4
- **Linting**: Biome + Ultracite

## Prerequisites

- Bun 1.3+
- Moon CLI 1.41+
- Docker Engine with `docker compose` (for Redis)

## Setup

```bash
# install dependencies
bun install

# start local redis
docker compose up -d

# create local environment file then replace it with real values
cp .env.example .env
# for local dev, set: TURSO_DATABASE_URL=file:local.db (no auth token needed)
```

## Structure

```text
.moon/                  # Moon workspace + shared task configuration
  tasks.yml             # Global lint / format / typecheck tasks
  toolchains.yml        # Bun toolchain configuration
  workspace.yml         # Project discovery
apps/
  web/                  # SvelteKit app
    src/routes/         # Pages, layouts, and API endpoints
  workers/              # BullMQ workers
  packages/
  database/             # Drizzle + libSQL (Turso)
  shared/               # Shared schemas, types, utilities
```

## Command model

```bash
# run a task in one project
moonx <project>:<task>

# run the same task across all projects
moonx :<task>
```

Global shared tasks live in `.moon/tasks.yml`.
Project-specific tasks live in `<project>/moon.yml`.

## Verified commands

These commands were verified from the repo root.

### Quality

```bash
# format all projects
moonx :format

# lint with fixes where possible
moonx :lint

# CI-style linting
moonx :lint-ci

# typecheck all projects
moonx :typecheck

# root ultracite wrappers
bun run check
bun run fix
```

### Development

```bash
# start the web app
moonx web:dev

# start workers in watch mode
moonx workers:dev

# run Svelte checks
moonx web:check
```

### Build

```bash
# build the web app
moonx web:build

# preview the production build
moonx web:preview

# start the production build
moonx web:start
```

`moonx web:start` requires a valid `.env` file because the shared env schema validates their values at runtime.

### Database

```bash
moonx database:db-push
moonx database:db-generate
moonx database:db-migrate
moonx database:db-studio
```

These commands also require `.env` to be present and valid.

## Notes

- There are currently no test files in the repository.
