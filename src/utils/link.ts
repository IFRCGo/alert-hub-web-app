import { generatePath } from 'react-router-dom';

import { WrappedRoutes } from '#routes';

export interface UrlParams {
    [key: string]: string | number | null | undefined;
}

export function resolvePath(
    to: keyof WrappedRoutes,
    routes: WrappedRoutes,
    urlParams: UrlParams | undefined,
) {
    const route = routes[to];

    try {
        const resolvedPath = generatePath(route.absoluteForwardPath, urlParams);
        return {
            ...route,
            resolvedPath,
        };
    } catch {
        return {
            ...route,
            resolvedPath: undefined,
        };
    }
}
