import {
    MyInputIndexRouteObject,
    MyInputNonIndexRouteObject,
    MyInputRouteObject,
    MyOutputIndexRouteObject,
    MyOutputNonIndexRouteObject,
    MyOutputRouteObject,
    unwrapRoute,
    wrapRoute,
} from '#utils/routes';

import PageError from './PageError';

// NOTE: setting default ExtendedProps
type ExtendedProps = { name?: string };
interface MyWrapRoute {
    <T>(
        myRouteOptions: MyInputIndexRouteObject<T, ExtendedProps>
    ): MyOutputIndexRouteObject<ExtendedProps>
    <T>(
        myRouteOptions: MyInputNonIndexRouteObject<T, ExtendedProps>
    ): MyOutputNonIndexRouteObject<ExtendedProps>
    <T>(
        myRouteOptions: MyInputRouteObject<T, ExtendedProps>,
    ): MyOutputRouteObject<ExtendedProps>
}
const myWrapRoute: MyWrapRoute = wrapRoute;

const root = myWrapRoute({
    title: '',
    path: '/',
    component: () => import('#views/RootLayout'),
    componentProps: {},
    errorElement: <PageError />,
});

const home = myWrapRoute({
    title: 'Home',
    path: '/',
    index: true,
    component: () => import('#views/Home'),
    componentProps: { name: 'IFRC Alert Hub' },
    parent: root,
});

const preferences = myWrapRoute({
    title: 'Preferences',
    path: 'preferences',
    component: () => import('#views/Preferences'),
    componentProps: {},
    parent: root,
});

const about = myWrapRoute({
    title: 'About',
    path: 'about',
    component: () => import('#views/About'),
    componentProps: {},
    parent: root,
});

const resources = myWrapRoute({
    title: 'Resources',
    path: 'resources',
    component: () => import('#views/Resources'),
    componentProps: {},
    parent: root,
});

const alertDetails = myWrapRoute({
    title: 'AlertDetails',
    path: 'alert-details/:alertId',
    component: () => import('#views/AlertDetails'),
    componentProps: {},
    parent: root,
});

const allSourcesFeeds = myWrapRoute({
    title: 'AllSourcesFeeds',
    path: 'feeds',
    component: () => import('#views/AllSourcesFeeds'),
    componentProps: {},
    parent: root,
});

export const wrappedRoutes = {
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
