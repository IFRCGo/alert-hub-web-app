# IFRC ALERT HUB

Web client for the [Alert Hub](https://alerthub.ifrc.org/) platform

## Getting started

### Prerequisites

You can either use [`docker`](https://www.docker.com/) or [`pnpm`](https://pnpm.io/) to locally run or build this application.

### Local setup

#### 1. Clone the repo

```bash
git clone git@github.com:IFRCGo/alert-hub-web-app.git
cd alert-hub-web-app
```

#### 2. Install the dependencies

```bash
# Skip if running through docker
pnpm install
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
pnpm start
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

## IFRC Alert Hub backend
The backend that serves the frontend application is maintained in a separate [repository](https://github.com/IFRCGo/alert-hub-backend).

We use a `docker-compose.yml` file (located at `./backend/docker-compose.yml`).
To run it, you need to set up a `.env` file.

Create a `.env` file with the following content:

```
# Include the backend services
COMPOSE_FILE=./backend/docker-compose.yml:./docker-compose-with-backend.yml

# Use the same .env file for both backend and web-app
BACKEND_ENV_FILE=../.env
```

> NOTE: `../` refers to the web-app folder, relative to `./backend/docker-compose.yml` (the main Docker Compose file).

## External facing API
Here is the documentation for [Alert Hub GraphQL Client Usage Guide](./APIDOCS.md)
