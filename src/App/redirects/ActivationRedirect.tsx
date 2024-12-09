import {
    generatePath,
    useNavigate,
    useParams,
} from 'react-router-dom';

import routes from '#routes';

interface ActivationParams {
    userId: string | undefined;
    token: string | undefined;
    [key: string]: string | undefined;
}

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { userId, token } = useParams<ActivationParams>();
    const navigate = useNavigate();

    const activationLink = (userId && token) ? ({
        pathname: (generatePath(routes.activation.absolutePath, { userId, token })),
    })
        : routes.pageNotFound.path;

    if (activationLink) {
        navigate(activationLink);
    }

    return null;
}

Component.displayName = 'ActivationRedirect';
