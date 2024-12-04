import { Navigate } from 'react-router-dom';

import {
    MyInputIndexRouteObject,
    MyInputNonIndexRouteObject,
    MyOutputIndexRouteObject,
    MyOutputNonIndexRouteObject,
    unwrapRoute,
} from '#utils/routes';

import Auth from '../Auth';
import {
    customWrapRoute,
    rootLayout,
} from './common';

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

type DefaultHomeChild = 'map';
const homeLayout = customWrapRoute({
    parent: rootLayout,
    forwardPath: 'map' satisfies DefaultHomeChild,
    component: {
        render: () => import('#views/Home'),
        props: {},
    },
    wrapperComponent: Auth,
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
    wrapperComponent: Auth,
    context: {
        title: 'My Subscriptions',
        visibility: 'is-authenticated',
    },
});

const subscriptionDetail = customWrapRoute({
    parent: rootLayout,
    path: 'subscriptions/:subscriptionId',
    component: {
        render: () => import('#views/MySubscription/SubscriptionDetail'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Subscription Detail',
        visibility: 'is-authenticated',
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
    wrapperComponent: Auth,
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
    wrapperComponent: Auth,
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
    wrapperComponent: Auth,
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
    wrapperComponent: Auth,
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
    wrapperComponent: Auth,
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
    wrapperComponent: Auth,
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
    wrapperComponent: Auth,
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
    wrapperComponent: Auth,
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
    wrapperComponent: Auth,
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
    wrapperComponent: Auth,
    context: {
        title: '404',
        visibility: 'anything',
    },
});
const register = customWrapRoute({
    parent: rootLayout,
    path: 'register',
    component: {
        render: () => import('#views/Register'),
        props: {},
    },
    context: {
        title: 'Register',
        visibility: 'is-not-authenticated',
    },
});

const login = customWrapRoute({
    parent: rootLayout,
    path: 'login',
    component: {
        render: () => import('#views/Login'),
        props: {},
    },
    wrapperComponent: Auth,
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
    wrapperComponent: Auth,
    context: {
        title: 'Recover Account',
        visibility: 'is-not-authenticated',
    },
});

/* const resendValidationEmail = customWrapRoute({
    parent: rootLayout,
    path: 'resend-validation-email',
    component: {
        render: () => import('#views/ResendValidationEmail'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Resend Validation Email',
        visibility: 'is-not-authenticated',
    },
}); */

const cookiePolicy = customWrapRoute({
    parent: rootLayout,
    path: 'cookie-policy',
    component: {
        render: () => import('#views/CookiePolicy'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Cookie Policy',
        visibility: 'anything',
    },
});

const recoverAccountConfirm = customWrapRoute({
    parent: rootLayout,
    path: 'recover-account/:userId/:resetToken',
    component: {
        render: () => import('#views/RecoverAccountConfirm'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Recover Account Confirm',
        visibility: 'is-not-authenticated',
    },
});

const resetPasswordRedirect = customWrapRoute({
    parent: rootLayout,
    path: 'permalink/user-password-reset/:userId/:resetToken',
    component: {
        render: () => import('../redirects/RecoverAccountRedirect.tsx'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Reset Password Redirect',
        visibility: 'is-not-authenticated',
    },
});
const activation = customWrapRoute({
    parent: rootLayout,
    path: 'activation/:userId/:token',
    component: {
        render: () => import('#views/Activation'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Activation',
        visibility: 'anything',
    },
});

const activationRedirect = customWrapRoute({
    parent: rootLayout,
    path: 'permalink/user-activation/:userId/:token',
    component: {
        render: () => import('../redirects/ActivationRedirect'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Activation Redirect',
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
    // resendValidationEmail,
    mySubscription,
    cookiePolicy,
    register,
    historicalAlerts,
    subscriptionDetail,
    recoverAccountConfirm,
    resetPasswordRedirect,
    activationRedirect,
    activation,
};

export const unwrappedRoutes = unwrapRoute(Object.values(wrappedRoutes));

export default wrappedRoutes;

export type WrappedRoutes = typeof wrappedRoutes;
