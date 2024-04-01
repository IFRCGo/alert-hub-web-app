const {
    APP_ENVIRONMENT,
    APP_API_ENDPOINT,
    APP_ADMIN_URL,
    APP_TITLE,
    APP_COMMIT_HASH,
    APP_VERSION,
    APP_MAPBOX_ACCESS_TOKEN,
} = import.meta.env;

export const environment = APP_ENVIRONMENT;

export const appTitle = APP_TITLE;
export const appCommitHash = APP_COMMIT_HASH;
export const appVersion = APP_VERSION;

export const api = APP_API_ENDPOINT;
export const adminUrl = APP_ADMIN_URL ?? api;

export const mbtoken = APP_MAPBOX_ACCESS_TOKEN;
