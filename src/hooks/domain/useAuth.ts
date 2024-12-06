import {
    useContext,
    useMemo,
} from 'react';
import { isDefined } from '@togglecorp/fujs';

import UserContext from '#contexts/user';

function useAuth() {
    const { userAuth } = useContext(UserContext);

    const isAuthenticated = isDefined(userAuth);

    return useMemo(
        () => ({ isAuthenticated }),
        [isAuthenticated],
    );
}

export default useAuth;
