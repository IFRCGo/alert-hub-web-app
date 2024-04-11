import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: process.env.APP_GRAPHQL_CODEGEN_ENDPOINT,
    documents: [
        'src/**/*.tsx',
        'src/**/*.ts'
    ],
    ignoreNoDocuments: true, // for better experience with the watcher
    generates: {
        './generated/types/': {
            preset: 'client'
        }
    }
}

export default config;
