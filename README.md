# Monorepo with moon

tl,dr

- settings dependencies and mostly shared configs stay in the root
- every config, adapter, lib, db, or anything that can be used by multiple apps, we store in a package
- every app reuse stuff from packages

## Commands

to run apps:

- `moon <app>:<task>`
- `moon :<task>` to run all `<task>` scripts
- e.g `moon demo:dev` to start the demo app with the dev task

instead of having `scripts` in the package.json file, we have two alternatives. on the root, we have a `.moon/tasks` file with the shared scripts, which are mostly settings, like formatting and linting.

on each package/app we have a `moon.yml` file with the package settings, like metadata and their own tasks.

^ if this approach is bad, it's possible to move to package.json scripts and [reuse then with moon](https://moonrepo.dev/docs/guides/javascript/node-handbook#using-packagejson-scripts)
