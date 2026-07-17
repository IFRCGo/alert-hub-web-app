import {
    defineConfig,
    overrideDefineForWebAppServe,
    Schema,
} from '@togglecorp/vite-plugin-validate-env';

const webAppServeEnabled = process.env.WEB_APP_SERVE_ENABLED?.toLowerCase() === 'true';
if (webAppServeEnabled) {
    // eslint-disable-next-line no-console
    console.warn('Building application for web-app-serve');
}
const overrideDefine = webAppServeEnabled
    ? overrideDefineForWebAppServe
    : undefined;

export default defineConfig({
    overrideDefine,
    validator: 'builtin',
    schema: {
        // Used in application (index.html %APP_TITLE%). Default (overridable):
        // the build-time value carries the web-app-serve placeholder marker and
        // the shared default is baked as an ENV in the Dockerfile final stage.
        APP_TITLE: Schema.string(),

        APP_ENVIRONMENT: (key: string, value: string) => {
            // NOTE: APP_ENVIRONMENT_PLACEHOLDER is meant to be used with image builds
            // The value will be later replaced with the actual value
            const regex = /^production|staging|testing|alpha-\d+|development|APP_ENVIRONMENT_PLACEHOLDER$/;
            const valid = !!value && (value.match(regex) !== null);
            if (!valid) {
                throw new Error(`Value for environment variable "${key}" must match regex "${regex}", instead received "${value}"`);
            }
            if (value === 'APP_ENVIRONMENT_PLACEHOLDER') {
                // eslint-disable-next-line no-console
                console.warn(`Using ${value} for app environment. Make sure to not use this for builds without web-app-serve`);
            }
            return value as ('production' | 'staging' | 'testing' | `alpha-${number}` | 'development' | 'APP_ENVIRONMENT_PLACEHOLDER');
        },
        APP_GRAPHQL_API_ENDPOINT: Schema.string({ format: 'url', protocol: true, tld: false }),
        APP_MAPBOX_ACCESS_TOKEN: Schema.string(),

        APP_HCAPTCHA_SITEKEY: Schema.string.optional(),

        // Used in codegen (build time). This is both a url and a file path, so it
        // is not URL-validated. No `import.meta.env` consumer, so the override's
        // entry for it is dead code (no runtime placeholder is emitted).
        APP_GRAPHQL_CODEGEN_ENDPOINT: Schema.string(),

        // NOTE: APP_GOOGLE_ANALYTICS_ID is intentionally NOT in this schema. It is
        // consumed only by VitePluginRadar in vite.config.ts (via loadEnv, at BUILD
        // time) to inject the GA <script> into index.html — it has no
        // `import.meta.env` consumer, so overrideDefineForWebAppServe cannot make it
        // a runtime placeholder. Instead the Dockerfile build stage sets it to the
        // raw web-app-serve placeholder marker so the injected script carries a
        // runtime slot that apply-config substitutes (preserving the old
        // nginx-serve runtime behavior).
        //
        // NOTE: APP_COMMIT_HASH and APP_VERSION are also intentionally NOT here.
        // They are build-time constants injected via vite `define` in vite.config.ts
        // (`import.meta.APP_COMMIT_HASH` / `import.meta.env.APP_VERSION`); keeping
        // them out of the schema stops the override from clobbering those defines.
    },
});
