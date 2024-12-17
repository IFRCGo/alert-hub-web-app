import {
    generatePath,
    useNavigate,
    useParams,
} from 'react-router-dom';

import routes from '#routes';

interface SubscriptionDetailsParams {
    subscriptionId: string | undefined;
    [key: string]: string | undefined;
}

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { subscriptionId } = useParams<SubscriptionDetailsParams>();
    const navigate = useNavigate();

    const subscriptionDetailsLink = (subscriptionId) ? ({
        pathname: (generatePath(
            routes.subscriptionDetail.absolutePath,
            { subscriptionId },
        )),
    })
        : routes.pageNotFound.path;

    if (subscriptionDetailsLink) {
        navigate(subscriptionDetailsLink);
    }

    return null;
}

Component.displayName = 'SubscriptionDetailsRedirect';
