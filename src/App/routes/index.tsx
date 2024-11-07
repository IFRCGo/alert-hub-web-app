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

const mySubscription = customWrapRoute({
    parent: rootLayout,
    path: 'subscriptions',
    component: {
        render: () => import('#views/MySubscription'),
        props: {},
    },
    context: {
        title: 'My Subscriptions',
        // TODO: Change visibility after login feature
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

const historicalAlerts = customWrapRoute({
    parent: rootLayout,
    path: 'historical-alerts',
    component: {
        render: () => import('#views/HistoricalAlerts'),
        props: {},
    },
    context: {
        title: 'Historical Alerts',
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

const pageNotFound = customWrapRoute({
    parent: rootLayout,
    path: '*',
    component: {
        render: () => import('#views/PageNotFound'),
        props: {},
    },
    context: {
        title: '404',
        visibility: 'anything',
    },
});

const login = customWrapRoute({
    parent: rootLayout,
    path: 'login',
    component: {
        render: () => import('#views/Login'),
        props: {},
    },
    context: {
        title: 'Login',
        visibility: 'is-not-authenticated',
    },
});

const recoverAccount = customWrapRoute({
    parent: rootLayout,
    path: 'recover-account',
    component: {
        render: () => import('#views/RecoverAccount'),
        props: {},
    },
    context: {
        title: 'Recover Account',
        visibility: 'is-not-authenticated',
    },
});

const resendValidationEmail = customWrapRoute({
    parent: rootLayout,
    path: 'resend-validation-email',
    component: {
        render: () => import('#views/ResendValidationEmail'),
        props: {},
    },
    context: {
        title: 'Resend Validation Email',
        visibility: 'is-not-authenticated',
    },
});

const cookiePolicy = customWrapRoute({
    parent: rootLayout,
    path: 'cookie-policy',
    component: {
        render: () => import('#views/CookiePolicy'),
        props: {},
    },
    context: {
        title: 'Cookie Policy',
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
    pageNotFound,
    login,
    recoverAccount,
    resendValidationEmail,
    mySubscription,
    cookiePolicy,
    historicalAlerts,
};

export const unwrappedRoutes = unwrapRoute(Object.values(wrappedRoutes));

export default wrappedRoutes;

export type WrappedRoutes = typeof wrappedRoutes;
