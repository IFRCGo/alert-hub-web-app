import { useContext } from 'react';
import { isNotDefined } from '@togglecorp/fujs';

import RouteContext from '#contexts/route';
import useAuth from '#hooks/domain/useAuth';
import { type WrappedRoutes } from '#routes';
import {
    resolvePath,
    UrlParams,
} from '#utils/link';

function useLink(props: {
    external: true,
    href: string | undefined | null,
    to?: never,
    urlParams?: never,
} | {
    external: false | undefined,
    to: keyof WrappedRoutes | undefined | null,
    urlParams?: UrlParams,
    href?: never,
}) {
    const { isAuthenticated } = useAuth();
    const routes = useContext(RouteContext);

    if (props.external) {
        if (isNotDefined(props.href)) {
            return { disabled: true, to: undefined };
        }
        return { disabled: false, to: props.href };
    }

    if (isNotDefined(props.to)) {
        return { disabled: true, to: undefined };
    }

    // eslint-disable-next-line react/destructuring-assignment
    const route = resolvePath(props.to, routes, props.urlParams);
    const { resolvedPath } = route;

    if (isNotDefined(resolvedPath)) {
        return { disabled: true, to: undefined };
    }

    const disabled = (route.visibility === 'is-authenticated' && !isAuthenticated)
        || (route.visibility === 'is-not-authenticated' && isAuthenticated);

    return {
        disabled,
        to: resolvedPath,
    };
}

export default useLink;
