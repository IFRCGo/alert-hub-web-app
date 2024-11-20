import '@ifrc-go/ui/index.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
} from '@apollo/client';
import { Language } from '@ifrc-go/ui/contexts';

import { api } from '#config';
import { KEY_LANGUAGE_STORAGE } from '#utils/constants';
import { getFromStorage } from '#utils/localStorage';

import App from './App';

const webappRootId = 'webapp-root';
const webappRootElement = document.getElementById(webappRootId);
const client = new ApolloClient({
    uri: api,
    cache: new InMemoryCache(),
    headers: {
        'Accept-Language': getFromStorage(KEY_LANGUAGE_STORAGE) ?? 'en' satisfies Language,
    },
    credentials: 'include',
    defaultOptions: {
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        watchQuery: {
            // NOTE: setting nextFetchPolicy to cache-and-network is risky
            fetchPolicy: 'network-only',
            nextFetchPolicy: 'cache-only',
            errorPolicy: 'all',
        },
    },
});
if (!webappRootElement) {
    // eslint-disable-next-line no-console
    console.error(`Could not find html element with id '${webappRootId}'`);
} else {
    ReactDOM.createRoot(webappRootElement).render(
        <React.StrictMode>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
            ,
        </React.StrictMode>,
    );
}
