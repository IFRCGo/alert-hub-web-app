import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import mapboxgl from 'mapbox-gl';

import { mbtoken } from '#config';
import RouteContext from '#contexts/route';

import {
    unwrappedRoutes,
    wrappedRoutes,
} from './routes';

const router = createBrowserRouter(unwrappedRoutes);
mapboxgl.accessToken = mbtoken || '';
mapboxgl.setRTLTextPlugin(
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    // eslint-disable-next-line no-console
    (err) => { console.error(err); },
    true,
);
function App() {
    return (
        <RouteContext.Provider value={wrappedRoutes}>
            <RouterProvider router={router} />
        </RouteContext.Provider>
    );
}

export default App;
