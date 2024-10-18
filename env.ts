import { defineConfig, Schema } from '@julr/vite-plugin-validate-env';

export default defineConfig({
    APP_TITLE: Schema.string.optional(),
    APP_MAPBOX_ACCESS_TOKEN: Schema.string(),
    APP_GRAPHQL_ENDPOINT: Schema.string.optional(),
    APP_GOOGLE_ANALYTICS_ID: Schema.string.optional(),
    APP_HCAPTCHA_SITEKEY: Schema.string.optional(),
});