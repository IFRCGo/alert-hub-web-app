const {
    APP_ENVIRONMENT,
    APP_GRAPHQL_API_ENDPOINT,
    APP_MAPBOX_ACCESS_TOKEN,
    APP_TITLE,
    APP_COMMIT_HASH,
    APP_VERSION,
    APP_HCAPTCHA_SITEKEY,
} = import.meta.env;

export const environment = APP_ENVIRONMENT;
export const appTitle = APP_TITLE;
export const api = APP_GRAPHQL_API_ENDPOINT;
export const mapboxToken = APP_MAPBOX_ACCESS_TOKEN;
export const hCaptchaKey = APP_HCAPTCHA_SITEKEY;
export const appCommitHash = APP_COMMIT_HASH;
export const appVersion = APP_VERSION;
