import { defineConfig, Schema } from '@julr/vite-plugin-validate-env';

// TODO: Integrate .env for CI and remove optional() call on required fields
export default defineConfig({
    APP_ENVIRONMENT: Schema.string.optional(),
    APP_GRAPHQL_API_ENDPOINT: Schema.string(),
    APP_MAPBOX_ACCESS_TOKEN: Schema.string(),
    APP_TITLE: Schema.string(),
    APP_GRAPHQL_CODEGEN_ENDPOINT: Schema.string.optional(),
    APP_GRAPHQL_ENDPOINT: Schema.string.optional(),
})
