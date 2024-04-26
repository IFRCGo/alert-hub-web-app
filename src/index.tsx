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

import { api } from '#config';

import App from './App';

const webappRootId = 'webapp-root';
const webappRootElement = document.getElementById(webappRootId);
const client = new ApolloClient({
    uri: api,
    cache: new InMemoryCache(),
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
