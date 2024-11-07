# -------------------------- Dev ---------------------------------------

FROM node:18-bullseye AS dev

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
        git bash g++ make \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

WORKDIR /code

RUN git config --global --add safe.directory /code


# -------------------------- Builder ---------------------------------------
FROM dev AS builder

COPY ./package.json ./pnpm-lock.yaml /code/

# TODO: patches are not working with this?
RUN pnpm install

COPY . /code/

# -------------------------- Nginx - Builder --------------------------------
FROM builder AS nginx-build

# Dynamic configs. Can be changed with containers. (Placeholder values)
ENV APP_TITLE=APP_TITLE_PLACEHOLDER
ENV APP_ENVIRONMENT=APP_ENVIRONMENT_PLACEHOLDER
ENV APP_MAPBOX_ACCESS_TOKEN=APP_MAPBOX_ACCESS_TOKEN_PLACEHOLDER
ENV APP_GOOGLE_ANALYTICS_ID=APP_GOOGLE_ANALYTICS_ID_PLACEHOLDER
ENV APP_GRAPHQL_API_ENDPOINT=https://APP-GRAPHQL-API-ENDPOINT-PLACEHOLDER.COM/

# Build variables (Requires backend pulled)
ENV APP_GRAPHQL_CODEGEN_ENDPOINT=./backend/schema.graphql

RUN pnpm generate && pnpm build

# ---------------------------------------------------------------------------
FROM nginx:1 AS nginx-serve

LABEL maintainer="IFRC"
LABEL org.opencontainers.image.source="github.com/IFRCGo/alert-hub-web-app"

COPY ./nginx-serve/apply-config.sh /docker-entrypoint.d/
COPY ./nginx-serve/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=nginx-build /code/build /code/build

ENV APPLY_CONFIG__SOURCE_DIRECTORY=/code/build/
ENV APPLY_CONFIG__DESTINATION_DIRECTORY=/usr/share/nginx/html/
ENV APPLY_CONFIG__OVERWRITE_DESTINATION=true
