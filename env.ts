import { defineConfig, Schema } from '@julr/vite-plugin-validate-env';

// TODO: Integrate .env for CI and remove optional() call on required fields
export default defineConfig({
    // Used in vite
    APP_GOOGLE_ANALYTICS_ID: Schema.string.optional(),

    // Used in application
    APP_TITLE: Schema.string.optional(), // NOTE: not used right now
    APP_ENVIRONMENT: (key, value) => {
        // NOTE: APP_ENVIRONMENT_PLACEHOLDER is meant to be used with image builds
        // The value will be later replaced with the actual value
        const regex = /^production|staging|testing|alpha-\d+|development|APP_ENVIRONMENT_PLACEHOLDER$/;
        const valid = !!value && (value.match(regex) !== null);
        if (!valid) {
            throw new Error(`Value for environment variable "${key}" must match regex "${regex}", instead received "${value}"`);
        }
        if (value === 'APP_ENVIRONMENT_PLACEHOLDER') {
            console.warn(`Using ${value} for app environment. Make sure to not use this for builds without nginx-serve`)
        }
        return value as ('production' | 'staging' | 'testing' | `alpha-${number}` | 'development' | 'APP_ENVIRONMENT_PLACEHOLDER');
    },
    APP_GRAPHQL_API_ENDPOINT: Schema.string({ format: 'url', protocol: true, tld: false }),
    APP_MAPBOX_ACCESS_TOKEN: Schema.string(),

    // Used in codegen
    APP_GRAPHQL_CODEGEN_ENDPOINT: Schema.string(), // NOTE: this is both url and file path

    // Used in application, automatically injected by vite
    APP_COMMIT_HASH: Schema.string.optional(),
    APP_VERSION: Schema.string.optional(),
})
