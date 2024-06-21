import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { unstable_batchedUpdates } from 'react-dom';
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
    isFalsyString,
    listToGroupList,
    listToMap,
    mapToList,
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
    const languageRequestTimeoutRef = useRef<number | undefined>();
    const [languagePending, setLanguagePending] = useState(false);

    const {
        currentLanguage,
        setStrings,
        setLanguageNamespaceStatus,
        languageNamespaceStatus,
    } = useContext(LanguageContext);

    const queuedLanguages = useMemo(
        () => {
            const languages = mapToList(
                languageNamespaceStatus,
                (item, key) => ({ key, status: item }),
            );
            return languages
                .filter((item) => item.status === 'queued')
                .map((item) => item.key)
                .sort()
                .join(',');
        },
        [languageNamespaceStatus],
    );

    const fetchLanguage = useCallback(async (lang: Language) => {
        const resource = await import(`./translations/${lang}.json`);
        const stringList = resource.default as {
            key: string;
            namespace: string;
            value: string;
        }[];

        const stringMap = mapToMap(
            listToGroupList(
                stringList,
                ({ namespace }) => namespace,
            ),
            (key) => key,
            (values) => (
                listToMap(
                    values,
                    ({ key }) => key,
                    ({ value }) => value,
                )
            ),
        );

        setStrings(stringMap);
    }, [setStrings]);

    useEffect(
        () => {
            if (
                languagePending
                    || currentLanguage === 'en'
                    || isFalsyString(queuedLanguages)
            ) {
                return undefined;
            }

            languageRequestTimeoutRef.current = window.setTimeout(
                () => {
                    const keys = queuedLanguages.split(',');

                    unstable_batchedUpdates(() => {
                        // FIXME: check if the component is still mounted
                        setLanguageNamespaceStatus(
                            (prevState) => ({
                                ...prevState,
                                ...listToMap(
                                    keys,
                                    (key) => key,
                                    () => 'pending',
                                ),
                            }),
                        );
                        setLanguagePending(true);
                    });

                    fetchLanguage(currentLanguage);
                },
                // FIXME: use constatnt
                200,
            );

            return () => {
                window.clearTimeout(languageRequestTimeoutRef.current);
            };
        },
        [
            currentLanguage,
            queuedLanguages,
            fetchLanguage,
            languagePending,
            setLanguageNamespaceStatus,
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
