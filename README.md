# IFRC ALERT HUB

Web client for the [Alert Hub](https://alerthub.ifrc.org/) platform

## Getting started

### Prerequisites

You can either use [`docker`](https://www.docker.com/) or [`yarn`](https://yarnpkg.com/) to locally run or build this application.

### Local setup

#### 1. Clone the repo

```bash
git clone git@github.com:IFRCGo/alert-hub-web-app.git
cd alert-hub-web-app
```

#### 2. Install the dependencies

```bash
# Skip if running through docker
yarn install
```

#### 3. Setup environment variables:

Create a `.env` file with following variables

```env
APP_TITLE=
APP_MAPBOX_ACCESS_TOKEN=
APP_GRAPHQL_API_ENDPOINT=
APP_GRAPHQL_CODEGEN_ENDPOINT=
```

You can contact IFRC team to get appropriate values for these variables

#### 4. Run dev instance

```bash
yarn start
# or
docker-compose up
```

## Directory Structure

```
.
├── patches/ (Patches to any of the external dependencies)
├── public/ (Content that needs to be copied during build)
├── generated/ (Generated files: eg. Typescript Definitions)
├── index.html (Base html file)
└── src/
    ├── App/
    │   ├── index.tsx (Defines providers: eg. Auth, Route, Request, Alert)
    │   └── routes.tsx
            ├── index.tsx (Defines routes for the pages)    
    ├── assets/ (images, icons)
    ├── components/ (Commonly used components)
    │   ├── domain/ (Components that are specific to a domain)
    ├── config.ts (Defines configurations read from environment variables)
    ├── declarations/ (Type declarations for external libraries)
    ├── hooks (React Hooks)
    ├── index.tsx (Initializes React)
    ├── utils (Utility functions)
    └── views/ (Pages that we can navigate on the platform)
        └── RootLayout/
            └── index.tsx (Defines root layout and requests fetched for DomainContext)
```

## External facing API
Here is the documentation for [Alert Hub GraphQL Client Usage Guide](./APIDOC.md)
