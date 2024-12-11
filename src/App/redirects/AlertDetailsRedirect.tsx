import {
    generatePath,
    useNavigate,
    useParams,
} from 'react-router-dom';

import routes from '#routes';

interface AlertDetailsParams {
    alertId: string | undefined;
    [key: string]: string | undefined;
}

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { alertId } = useParams<AlertDetailsParams>();
    const navigate = useNavigate();

    const alertDetailsLink = (alertId) ? ({
        pathname: (generatePath(
            routes.alertDetails.absolutePath,
            { alertId },
        )),
    })
        : routes.pageNotFound.path;

    if (alertDetailsLink) {
        navigate(alertDetailsLink);
    }

    return null;
}

Component.displayName = 'AlertDetailsRedirect';
