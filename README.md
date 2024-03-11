# React Base App

React base app with some oompf

## What is included?

### Vite

- Sourcemaps are generated on production build
- `tsc`, `eslint` and `stylelint` are run on production build.
- All of the assets will be compressed on production build.
- The build is be placed under `build/` directory

### React

- Vite is configured with React Refresh
- SWC is used instead of Babel

### PostCSS

PostCSS is configured with the following plugins:

- Preset Env
- Nested CSS
- Normalize CSS
- Autoprefixer
- CSS Modules

### Web Fonts

- Web fonts are downloaded and bundled in the production build.
- Valid web font providers are:
  - Google Fonts
  - Bunny Fonts
  - Fontshare

### Absolute Imports

- Vite is configured to resolve absolute imports defined on `tsconfig.json`

### Environment Variables

Only environment variables prefixed by `APP_` will be passed to the application

Variables can be defined using:

- `.env` file
  - Use `.env` file to define secrets.
- `docker-compose` file
  - Use `docker-compose` file to define rest of the env variables.

The user defined environment variables are validated using the configuration at `./env.ts`
The typings for environment variables are defined at `./src/declarations/env.d.ts`.

### Git Revision

The commit hash is passed to the application through the environment variable `APP_COMMIT_HASH`

### Test

- `vitest` is used to run tests

### Checks

- `stylelint` is used to lint css files
- `eslint` is used to lint javascript and typescript files
- `tsc` is used to typecheck typescript files
- `unimported` to used to detect unused javascript and typescript files

### Docker

Docker is setup to run vite on port 3000

### Github Actions

- A workflow is setup to run when:
  - new commit is pushed to develop branch
  - or a pull request to develop branch is opened
- It checks for unused files, lint issues, failed tests and failed builds.

### Pull Request Template

- A generic pull request template is included.

## What needs to be included?

[Checklist](CHECKLIST.md)
