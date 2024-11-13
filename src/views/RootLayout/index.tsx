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
import { AlertInformationLineIcon } from '@ifrc-go/icons';
import {
    AlertContainer,
    Button,
    Container,
    PageContainer,
} from '@ifrc-go/ui';
import {
    Language,
    LanguageContext,
} from '@ifrc-go/ui/contexts';
import {
    useBooleanState,
    useTranslation,
} from '@ifrc-go/ui/hooks';
import {
    _cs,
    listToGroupList,
    listToMap,
    mapToMap,
} from '@togglecorp/fujs';

import GlobalFooter from '#components/GlobalFooter';
import Link from '#components/Link';
import Navbar from '#components/Navbar';
import useDebouncedValue from '#hooks/useDebouncedValue';

import i18n from './i18n.json';
import styles from './styles.module.css';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);
    const { state } = useNavigation();
    const isLoading = state === 'loading';
    const isLoadingDebounced = useDebouncedValue(isLoading);
    const [languagePending, setLanguagePending] = useState(false);

    const {
        currentLanguage,
        setStrings,
    } = useContext(LanguageContext);

    // FIXME: To be made functional after the implications of cookie rejections are finalized
    const [
        isCookiesBannerVisible,
        { setFalse: hideCookiesBanner },
    ] = useBooleanState(false);

    const handleClick = useCallback(() => {
        // FIXME: Add cookies permission to session storage
        hideCookiesBanner();
    }, [hideCookiesBanner]);

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
            {isCookiesBannerVisible && (
                <div className={styles.bannersContainer}>
                    {isCookiesBannerVisible && (
                        <PageContainer className={styles.cookiesBanner}>
                            <Container
                                withoutWrapInHeading
                                headingDescription={strings.cookiesBannerDescription}
                                icons={(
                                    <AlertInformationLineIcon
                                        className={styles.alertInfoIcon}
                                    />
                                )}
                                spacing="comfortable"
                                actions={(
                                    <>
                                        <Link
                                            to="cookiePolicy"
                                            variant="tertiary"
                                        >
                                            {strings.cookiesBannerLearnMore}
                                        </Link>
                                        <Button
                                            name={undefined}
                                            variant="primary"
                                            onClick={handleClick}
                                        >
                                            {strings.cookiesBannerIAccept}
                                        </Button>
                                    </>
                                )}
                            />
                        </PageContainer>
                    )}
                </div>
            )}
        </div>
    );
}

Component.displayName = 'Root';
