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

import App from './App';

const webappRootId = 'webapp-root';
const webappRootElement = document.getElementById(webappRootId);
const APP_GRAPHQL_ENDPOINT = 'http://localhost:8000/graphql/';
const client = new ApolloClient({
    uri: APP_GRAPHQL_ENDPOINT,
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
