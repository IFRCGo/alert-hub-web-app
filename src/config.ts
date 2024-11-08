const {
    APP_TITLE,
    APP_ENVIRONMENT,
    APP_GRAPHQL_API_ENDPOINT,
    APP_MAPBOX_ACCESS_TOKEN,
    APP_COMMIT_HASH,
    APP_VERSION,
} = import.meta.env;

export const appTitle = APP_TITLE; // not used
export const environment = APP_ENVIRONMENT; // not used
export const api = APP_GRAPHQL_API_ENDPOINT;
export const mapboxToken = APP_MAPBOX_ACCESS_TOKEN;
export const appCommitHash = APP_COMMIT_HASH;
export const appVersion = APP_VERSION;
