import {
    Fragment,
    type ReactElement,
} from 'react';
import { Navigate } from 'react-router-dom';

import useAuth from '#hooks/domain/useAuth';

import { type ExtendedProps } from './routes/common';

interface Props {
    children: ReactElement,
    context: ExtendedProps,
    absolutePath: string,
}
function Auth(props: Props) {
    const {
        context,
        children,
        absolutePath,
    } = props;

    const { isAuthenticated } = useAuth();

    if (context.visibility === 'is-authenticated' && !isAuthenticated) {
        return (
            <Navigate to="/login" />
        );
    }
    if (context.visibility === 'is-not-authenticated' && isAuthenticated) {
        return (
            <Navigate to="/" />
        );
    }

    return (
        <Fragment
            key={absolutePath}
        >
            {children}
        </Fragment>
    );
}

export default Auth;
