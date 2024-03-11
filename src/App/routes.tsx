import {
    wrapRoute,
    unwrapRoute,
} from '#utils/routes';
import type {
    MyInputRouteObject,
    MyInputIndexRouteObject,
    MyInputNonIndexRouteObject,
    MyOutputIndexRouteObject,
    MyOutputNonIndexRouteObject,
    MyOutputRouteObject,
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
    component: () => import('#views/Root'),
    componentProps: {},
    errorElement: <PageError />,
});

const home = myWrapRoute({
    title: 'Home',
    index: true,
    component: () => import('#views/Home'),
    componentProps: { name: 'Pine Apple' },
    parent: root,
});

const preferences = myWrapRoute({
    title: 'Preferences',
    path: 'preferences',
    component: () => import('#views/Preferences'),
    componentProps: {},
    parent: root,
});

export const wrappedRoutes = {
    root,
    home,
    preferences,
};

export const unwrappedRoutes = unwrapRoute(Object.values(wrappedRoutes));
