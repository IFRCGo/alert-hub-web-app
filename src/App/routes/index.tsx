import { Navigate } from 'react-router-dom';

import {
    MyInputIndexRouteObject,
    MyInputNonIndexRouteObject,
    MyOutputIndexRouteObject,
    MyOutputNonIndexRouteObject,
    unwrapRoute,
    wrapRoute,
} from '#utils/routes';
import { Component as RootLayout } from '#views/RootLayout';

import PageError from '../PageError';

// NOTE: setting default ExtendedProps
export type ExtendedProps = {
    title: string,
    visibility: 'is-authenticated' | 'is-not-authenticated' | 'anything',
};

export interface MyWrapRoute {
    <T>(
        myRouteOptions: MyInputIndexRouteObject<T, ExtendedProps>
    ): MyOutputIndexRouteObject<ExtendedProps>
    <T>(
        myRouteOptions: MyInputNonIndexRouteObject<T, ExtendedProps>
    ): MyOutputNonIndexRouteObject<ExtendedProps>
}

const customWrapRoute: MyWrapRoute = wrapRoute;

const rootLayout = customWrapRoute({
    path: '/',
    errorElement: <PageError />,
    component: {
        render: RootLayout,
        eagerLoad: true,
        props: {},
    },
    context: {
        title: 'IFRC Alert Hub',
        visibility: 'anything',
    },
});

type DefaultHomeChild = 'map';
const homeLayout = customWrapRoute({
    parent: rootLayout,
    forwardPath: 'map' satisfies DefaultHomeChild,
    component: {
        render: () => import('#views/Home'),
        props: {},
    },
    context: {
        title: 'IFRC Alert Hub',
        visibility: 'anything',
    },
});

const homeIndex = customWrapRoute({
    parent: homeLayout,
    index: true,
    component: {
        eagerLoad: true,
        render: Navigate,
        props: {
            to: 'map' satisfies DefaultHomeChild,
            replace: true,
        },
    },
    context: {
        title: 'IFRC Alert Hub',
        visibility: 'anything',
    },
});

const homeMap = customWrapRoute({
    parent: homeLayout,
    path: 'map' satisfies DefaultHomeChild,
    component: {
        render: () => import('#views/Home/AlertsMap'),
        props: {},
    },
    context: {
        title: 'IFRC Alert Hub - Map',
        visibility: 'anything',
    },
});

const homeTable = customWrapRoute({
    parent: homeLayout,
    path: 'table',
    component: {
        render: () => import('#views/Home/AlertsTable'),
        props: {},
    },
    context: {
        title: 'IFRC Alert Hub - Table',
        visibility: 'anything',
    },
});

const preferences = customWrapRoute({
    parent: rootLayout,
    path: 'preferences',
    component: {
        render: () => import('#views/Preferences'),
        props: {},
    },
    context: {
        title: 'Preferences',
        visibility: 'anything',
    },
});

const about = customWrapRoute({
    parent: rootLayout,
    path: 'about',
    component: {
        render: () => import('#views/About'),
        props: {},
    },
    context: {
        title: 'About',
        visibility: 'anything',
    },
});

const resources = customWrapRoute({
    parent: rootLayout,
    path: 'resources',
    component: {
        render: () => import('#views/Resources'),
        props: {},
    },
    context: {
        title: 'Resources',
        visibility: 'anything',
    },
});

const alertDetails = customWrapRoute({
    parent: rootLayout,
    path: 'alert-details/:alertId',
    component: {
        render: () => import('#views/AlertDetails'),
        props: {},
    },
    context: {
        title: 'Alert Details',
        visibility: 'anything',
    },
});

const allSourcesFeeds = customWrapRoute({
    parent: rootLayout,
    path: 'feeds',
    component: {
        render: () => import('#views/AllSourcesFeeds'),
        props: {},
    },
    context: {
        title: 'Sources Feeds',
        visibility: 'anything',
    },
});

const wrappedRoutes = {
    rootLayout,
    homeLayout,
    homeIndex,
    homeMap,
    homeTable,
    preferences,
    alertDetails,
    resources,
    allSourcesFeeds,
    about,
};

export const unwrappedRoutes = unwrapRoute(Object.values(wrappedRoutes));

export default wrappedRoutes;

export type WrappedRoutes = typeof wrappedRoutes;
