import {
    Outlet,
    useNavigation,
} from 'react-router-dom';
import { AlertContainer } from '@ifrc-go/ui';
import { _cs } from '@togglecorp/fujs';

import Navbar from '#components/Navbar';
import useDebouncedValue from '#hooks/useDebouncedValue';

import styles from './styles.module.css';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { state } = useNavigation();
    const isLoading = state === 'loading';
    const isLoadingDebounced = useDebouncedValue(isLoading);

    return (
        <div className={styles.root}>
            {(isLoading || isLoadingDebounced) && (
                <div
                    className={_cs(
                        styles.navigationLoader,
                        !isLoading && isLoadingDebounced && styles.disappear,
                    )}
                />
            )}
            <Navbar className={styles.navbar} />
            <div className={styles.pageContent}>
                <Outlet />
            </div>
            <AlertContainer />
        </div>
    );
}

Component.displayName = 'Root';
