import { createContext } from 'react';

import { type WrappedRoutes } from '#routes';

const RouteContext = createContext<WrappedRoutes>(
    // NOTE: we will make sure the route information is passed
    {} as WrappedRoutes,
);

export default RouteContext;
