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

const myWrapRoute: MyWrapRoute = wrapRoute;

const root = myWrapRoute({
    path: '/',
    component: {
        render: RootLayout,
        eagerLoad: true,
        props: {},
    },
    context: {
        title: 'IFRC Alert Hub',
        visibility: 'anything',
    },
    errorElement: <PageError />,
});

const home = myWrapRoute({
    index: true,
    component: {
        render: () => import('#views/Home'),
        props: {},
    },
    context: {
        title: 'IFRC Alert Hub',
        visibility: 'anything',
    },
    parent: root,
});

const preferences = myWrapRoute({
    path: 'preferences',
    component: {
        render: () => import('#views/Preferences'),
        props: {},
    },
    context: {
        title: 'Preferences',
        visibility: 'anything',
    },
    parent: root,
});
const about = myWrapRoute({
    path: 'about',
    component: {
        render: () => import('#views/About'),
        props: {},
    },
    context: {
        title: 'About',
        visibility: 'anything',
    },
    parent: root,
});

const resources = myWrapRoute({
    path: 'resources',
    component: {
        render: () => import('#views/Resources'),
        props: {},
    },
    context: {
        title: 'Resources',
        visibility: 'anything',
    },
    parent: root,
});

const alertDetails = myWrapRoute({
    path: 'alert-details/:alertId',
    component: {
        render: () => import('#views/AlertDetails'),
        props: {},
    },
    context: {
        title: 'Alert Details',
        visibility: 'anything',
    },
    parent: root,
});

const allSourcesFeeds = myWrapRoute({
    path: 'feeds',
    component: {
        render: () => import('#views/AllSourcesFeeds'),
        props: {},
    },
    context: {
        title: 'Sources Feeds',
        visibility: 'anything',
    },
    parent: root,
});

const wrappedRoutes = {
    root,
    home,
    preferences,
    alertDetails,
    resources,
    allSourcesFeeds,
    about,
};

export const unwrappedRoutes = unwrapRoute(Object.values(wrappedRoutes));

export default wrappedRoutes;

export type WrappedRoutes = typeof wrappedRoutes;
