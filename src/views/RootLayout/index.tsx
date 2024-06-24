import {
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    Outlet,
    useNavigation,
} from 'react-router-dom';
import { AlertContainer } from '@ifrc-go/ui';
import {
    Language,
    LanguageContext,
} from '@ifrc-go/ui/contexts';
import {
    _cs,
    listToGroupList,
    listToMap,
    mapToMap,
} from '@togglecorp/fujs';

import GlobalFooter from '#components/GlobalFooter';
import Navbar from '#components/Navbar';
import useDebouncedValue from '#hooks/useDebouncedValue';

import styles from './styles.module.css';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { state } = useNavigation();
    const isLoading = state === 'loading';
    const isLoadingDebounced = useDebouncedValue(isLoading);
    const [languagePending, setLanguagePending] = useState(false);

    const {
        currentLanguage,
        setStrings,
    } = useContext(LanguageContext);

    const fetchLanguage = useCallback(async (lang: Language) => {
        setLanguagePending(true);
        const resource = await import(`./translations/${lang}.json`);
        const stringList = resource.default as {
            key: string;
            namespace: string;
            value: string;
        }[];

        setStrings((oldValue) => ({
            ...oldValue,
            ...mapToMap(
                listToGroupList(
                    stringList,
                    ({ namespace }) => namespace,
                ),
                (key) => key,
                (values, k) => ({
                    ...oldValue[k],
                    ...listToMap(
                        values,
                        ({ key }) => key,
                        ({ value }) => value,
                    ),
                }),
            ),
        }));
        setLanguagePending(false);
    }, [setStrings]);

    useEffect(
        () => {
            if (
                languagePending || currentLanguage === 'en'
            ) {
                return;
            }

            fetchLanguage(currentLanguage);
        },
        [
            currentLanguage,
            languagePending,
            fetchLanguage,
        ],
    );

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
            <GlobalFooter
                className={styles.footer}
            />
            <AlertContainer />
        </div>
    );
}

Component.displayName = 'Root';
