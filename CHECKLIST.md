# Checklist

## Build Requirements

- [x] Vite
  - [x] Compression
  - [x] Sourcemaps
  - [x] Environment variables (validation and typesafe)
  - [x] Versioning
- [x] Babel or SWC (for transpiling)
  - [ ] Polyfilling ->  https://github.com/alloc/vite-plugin-legacy
- [ ] Bundle Visualizer ->  https://github.com/btd/rollup-plugin-visualizer

## DX-1 Requirements

- [x] Absolute imports (configure eslint and vite)
- [x] React Hot Reloading
- [x] Postcss
  - [x] CSS Modules
  - [x] Nested CSS
  - [x] Normalize CSS
  - [x] Autoprefixer
  - [ ] Setup lint for unused css modules
- [x] Typescript
- [x] Stylelint
- [x] Unimported
- [x] Eslint
  - [ ] Multiple configurations
- [x] Testing

## DX-2 Requirements

- [x] Docker
- [x] Github Actions
  - [x] Parallel execution
  - [x] Eslint
  - [x] Stylelint
  - [x] Typescript
  - [x] Build
  - [x] Testing
- [x] PR templates
- [x] Documentations

### Web App Requirements

- [x] Fonts
- [ ] Sentry
- [ ] i18n
- [ ] Captcha
- [ ] Images -> https://github.com/ElMassimo/vite-plugin-image-presets
- [ ] Icons -> https://github.com/antfu/unplugin-icons
- [ ] PWA -> https://github.com/vite-pwa/vite-plugin-pwa
- [ ] Analytics -> https://github.com/stafyniaksacha/vite-plugin-radar

#### Routing and Auth

- [x] Routing
  - [x] Typesafe
  - [ ] Error boundaries
  - [ ] Authenticate/Authorize
- [ ] Link with permissions
- [ ] Detect login on different tab
- [ ] Login as certain user

#### Network

- [ ] GraphQL
- [ ] GraphQL Code Generator
  - [ ] Typescript Types

### UI Library Requirements

- [ ] Storybook
- [ ] NPM package

### Static Site Generation
