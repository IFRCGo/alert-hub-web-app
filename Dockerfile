# -------------------------- Dev ---------------------------------------

# NOTE: node >= 22 is required by @togglecorp/vite-plugin-validate-env (its
# config bundle uses a RegExp `v` flag that older node cannot parse). Bumped from
# node:18 as part of the web-app-serve migration's env-plugin upgrade.
FROM node:22-bullseye AS dev

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

# -------------------------- web-app-serve - Builder ------------------------
FROM builder AS web-app-serve-build

# NOTE: Dynamic env variables.
# These can be dynamically defined in the web-app-serve container at runtime. The
# build-time values below only need to be valid for env.ts schema validation;
# overrideDefineForWebAppServe replaces the `import.meta.env.*` references with
# runtime placeholders. See the "schema" field in "./env.ts".
# NOTE: APP_TITLE is also consumed at build time by Vite's `%APP_TITLE%` HTML
# replacement in index.html (overrideDefine only rewrites `import.meta.env.*` in
# JS). Use the raw web-app-serve placeholder marker as the build value so the
# served index.html carries a runtime placeholder too (same trick as JS keys).
ENV APP_TITLE=WEB_APP_SERVE_PLACEHOLDER__APP_TITLE
ENV APP_ENVIRONMENT=development
ENV APP_GRAPHQL_API_ENDPOINT=https://web-app-serve-placeholder.com/
ENV APP_MAPBOX_ACCESS_TOKEN=web-app-serve-placeholder
ENV APP_HCAPTCHA_SITEKEY=web-app-serve-placeholder

# NOTE: APP_GOOGLE_ANALYTICS_ID is NOT in the env.ts schema (no `import.meta.env`
# consumer). It is consumed only by VitePluginRadar (via loadEnv) to inject the GA
# <script> into index.html. Set it to the raw placeholder marker so the injected
# script carries a runtime slot that apply-config substitutes (or blanks) at
# startup — preserving the old nginx-serve runtime-configurable GA behavior.
ENV APP_GOOGLE_ANALYTICS_ID=WEB_APP_SERVE_PLACEHOLDER__APP_GOOGLE_ANALYTICS_ID

# Build variable (Requires backend submodule pulled for codegen)
ENV APP_GRAPHQL_CODEGEN_ENDPOINT=./backend/schema.graphql

# NOTE: WEB_APP_SERVE_ENABLED=true swaps the above build-time values for
# web-app-serve runtime placeholders. See "overrideDefine" in "./env.ts".
RUN pnpm generate \
    && WEB_APP_SERVE_ENABLED=true pnpm build

# ---------------------------------------------------------------------------
# Final image using web-app-serve
FROM ghcr.io/toggle-corp/web-app-serve:v0.1.2 AS web-app-serve

LABEL maintainer="IFRC"
LABEL org.opencontainers.image.source="https://github.com/IFRCGo/alert-hub-web-app"

# Env for apply-config script (base image only presets DESTINATION_DIRECTORY)
ENV APPLY_CONFIG__SOURCE_DIRECTORY=/code/build/

COPY --from=web-app-serve-build /code/build "$APPLY_CONFIG__SOURCE_DIRECTORY"

# Ship a hardened custom apply-config (grep ^APP_) instead of the base image's
# stock default-app-apply-config.sh. The stock script only substitutes vars that
# are SET and never blanks unfilled markers, so an unset var leaked the literal
# WEB_APP_SERVE_PLACEHOLDER__* marker into the bundle — visibly so for APP_TITLE,
# which appears as `%APP_TITLE%` in index.html (<title>, noscript, splash). Our
# script escapes sed metachars (values with &/|/\ substitute literally, no crash)
# and blanks unfilled placeholders to "" (restores the old nginx-serve semantics:
# unset == empty/falsy). See ./web-app-serve/apply-config.sh.
COPY ./web-app-serve/apply-config.sh /web-app-serve/app-apply-config.sh
RUN chmod +x /web-app-serve/app-apply-config.sh
ENV APPLY_CONFIG__APPLY_CONFIG_PATH=/web-app-serve/app-apply-config.sh

# NOTE: APP_TITLE is a default (overridable) var — it has a sensible shared
# default ("IFRC Alert Hub") but stays runtime-overridable. Bake the default as an
# ENV here in the final stage; apply-config substitutes it at startup like any
# other var, so deployments need not set it, yet can override it. (The build stage
# sets APP_TITLE to the raw placeholder marker so index.html carries a runtime slot.)
ENV APP_TITLE="IFRC Alert Hub"
