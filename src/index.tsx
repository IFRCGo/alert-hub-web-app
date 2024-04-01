import './index.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

const webappRootId = 'webapp-root';

const webappRootElement = document.getElementById(webappRootId);

if (!webappRootElement) {
    // eslint-disable-next-line no-console
    console.error(`Could not find html element with id '${webappRootId}'`);
} else {
    ReactDOM.createRoot(webappRootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
}
