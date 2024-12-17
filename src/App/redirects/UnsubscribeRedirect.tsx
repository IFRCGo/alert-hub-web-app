import {
    generatePath,
    useNavigate,
    useParams,
} from 'react-router-dom';

import routes from '#routes';

interface UnsubscribeParams {
    subscriptionId: string | undefined;
    token: string | undefined;
    [key: string]: string | undefined;
}

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { subscriptionId, token } = useParams<UnsubscribeParams>();
    const navigate = useNavigate();

    const unsubscribeLink = (subscriptionId && token) ? ({
        pathname: (generatePath(routes.unsubscribe.absolutePath, { subscriptionId, token })),
    })
        : routes.pageNotFound.path;

    if (unsubscribeLink) {
        navigate(unsubscribeLink);
    }

    return null;
}

Component.displayName = 'UnsubscribeRedirect';
