# -------------------------- Dev ---------------------------------------

FROM node:20-bookworm AS dev

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
        git bash g++ make \
    && rm -rf /var/lib/apt/lists/* \
    # NOTE: yarn > 1.22.19 breaks yarn-install invoked by pnpm
    && npm install -g pnpm@8.6.0 yarn@1.22.19 --force

RUN npm install -g pnpm

WORKDIR /code

RUN git config --global --add safe.directory /code


# -------------------------- Builder ---------------------------------------
FROM dev AS builder

COPY ./package.json ./pnpm-lock.yaml /code/
COPY ./patches /code/patches/

# TODO: patches are not working with this?
RUN pnpm install

COPY . /code/

FROM builder AS web-app-serve-build

# Dynamic configs. Can be changed with containers. (Placeholder values)
ENV APP_TITLE=WEB_APP_SERVE_PLACEHOLDER__APP_TITLE
ENV APP_ENVIRONMENT=production
ENV APP_MAPBOX_ACCESS_TOKEN=WEB_APP_SERVE_PLACEHOLDER__APP_MAPBOX_ACCESS_TOKEN
ENV APP_GOOGLE_ANALYTICS_ID=G-PZ
ENV APP_GRAPHQL_API_ENDPOINT=https://my-best-dashboard.com/graphql/
ENV APP_HCAPTCHA_SITEKEY=100--ff

# Build variables (Requires backend pulled)
ENV APP_GRAPHQL_CODEGEN_ENDPOINT=./backend/schema.graphql

RUN pnpm generate && \
    WEB_APP_SERVE_ENABLED=true pnpm build

FROM ghcr.io/toggle-corp/web-app-serve:v0.1.2 AS web-app-serve

WORKDIR /code

LABEL maintainer="IFRC"
LABEL org.opencontainers.image.source="https://github.com/IFRCGo/alert-hub-web-app"

ENV APPLY_CONFIG__SOURCE_DIRECTORY=/code/build/

COPY --from=web-app-serve-build /code/build /code/build/
