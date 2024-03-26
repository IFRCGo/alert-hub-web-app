import { defineConfig, Schema } from '@julr/vite-plugin-validate-env';

export default defineConfig({
    APP_TITLE: Schema.string.optional(),
    APP_MAPBOX_ACCESS_TOKEN: Schema.string(),
})
