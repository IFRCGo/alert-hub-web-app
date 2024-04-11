import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import mapboxgl from 'mapbox-gl';

import { mapboxToken } from '#config';

import { unwrappedRoutes } from './routes';

const router = createBrowserRouter(unwrappedRoutes);
mapboxgl.accessToken = mapboxToken;

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
