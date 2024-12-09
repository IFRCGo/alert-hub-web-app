import {
    generatePath,
    useNavigate,
    useParams,
} from 'react-router-dom';

import routes from '#routes';

interface ResetPasswordParams {
    userId: string | undefined;
    resetToken: string | undefined;
    [key: string]: string | undefined;
}

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { userId, resetToken } = useParams<ResetPasswordParams>();
    const navigate = useNavigate();

    const resetPasswordLink = (userId && resetToken) ? ({
        pathname: (generatePath(
            routes.recoverAccountConfirm.absolutePath,
            { userId, resetToken },
        )),
    })
        : routes.pageNotFound.path;

    if (resetPasswordLink) {
        navigate(resetPasswordLink);
    }

    return null;
}

Component.displayName = 'RecoverAccountRedirect';
