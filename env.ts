import { defineConfig, Schema } from '@julr/vite-plugin-validate-env';

// TODO: Integrate .env for CI and remove optional() call on required fields
export default defineConfig({
    APP_TITLE: Schema.string.optional(),
    APP_MAPBOX_ACCESS_TOKEN: Schema.string.optional(),
})
