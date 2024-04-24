import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import mapboxgl from 'mapbox-gl';

import { mapboxToken } from '#config';
import RouteContext from '#contexts/route';

import wrappedRoutes, { unwrappedRoutes } from './routes';

const router = createBrowserRouter(unwrappedRoutes);
mapboxgl.accessToken = mapboxToken;

function App() {
    return (
        <RouteContext.Provider value={wrappedRoutes}>
            <RouterProvider router={router} />
        </RouteContext.Provider>
    );
}

export default App;
