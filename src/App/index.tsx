import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import mapboxgl from 'mapbox-gl';

import { mbtoken } from '#config';

import { unwrappedRoutes } from './routes';

const router = createBrowserRouter(unwrappedRoutes);
mapboxgl.accessToken = mbtoken;

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
