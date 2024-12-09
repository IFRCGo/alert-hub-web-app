import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    AlertContext,
    AlertContextProps,
    AlertParams,
    type Language,
    LanguageContext,
    type LanguageContextProps,
    type LanguageNamespaceStatus,
} from '@ifrc-go/ui/contexts';
import {
    isDefined,
    unique,
} from '@togglecorp/fujs';
import mapboxgl from 'mapbox-gl';

import { mapboxToken } from '#config';
import RouteContext from '#contexts/route';
import UserContext, {
    UserAuth,
    UserContextProps,
} from '#contexts/user';
import { MeQuery } from '#generated/types/graphql';
import { KEY_LANGUAGE_STORAGE } from '#utils/constants';
import {
    getFromStorage,
    setToStorage,
} from '#utils/localStorage';

import wrappedRoutes, { unwrappedRoutes } from './routes';

import styles from './styles.module.css';

const ME = gql`
    query Me {
        public {
            me {
                city
                country
                displayName
                email
                firstName
                id
                lastName
                phoneNumber
            }
        }
    }
`;

const router = createBrowserRouter(unwrappedRoutes);
mapboxgl.accessToken = mapboxToken;
mapboxgl.setRTLTextPlugin(
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    // eslint-disable-next-line no-console
    (err) => { console.error(err); },
    true,
);

const baseString: LanguageContextProps['strings'] = {};

function App() {
    const [
        strings,
        setStrings,
    ] = useState<Record<string, LanguageContextProps['strings']>>({});

    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

    // FIXME: this is not used
    const [
        languageNamespaceStatus,
        setLanguageNamespaceStatus,
    ] = useState<Record<string, LanguageNamespaceStatus>>({});

    useEffect(() => {
        const language = getFromStorage<Language>(KEY_LANGUAGE_STORAGE);
        setCurrentLanguage(language ?? 'en');
    }, []);

    const setAndStoreCurrentLanguage = useCallback(
        (newLanguage: Language) => {
            setCurrentLanguage(newLanguage);
            setToStorage(KEY_LANGUAGE_STORAGE, newLanguage);
        },
        [],
    );

    // AUTH

    const [userAuth, setUserAuth] = useState<UserAuth>();

    const removeUserAuth = useCallback(() => {
        setUserAuth(undefined);
    }, []);

    // Hydration
    useEffect(() => {
        const language = getFromStorage<Language>(KEY_LANGUAGE_STORAGE);
        setCurrentLanguage(language ?? 'en');
    }, []);

    const [ready, setReady] = useState(false);

    useQuery<MeQuery>(
        ME,
        {
            onCompleted: (response) => {
                setReady(true);
                if (response.public.me) {
                    setUserAuth(response.public.me);
                } else {
                    removeUserAuth();
                }
            },
            onError: () => {
                setReady(true);
            },
        },
    );

    const userContextValue = useMemo<UserContextProps>(
        () => ({
            userAuth,
            setUserAuth,
            removeUserAuth,
        }),
        [userAuth, removeUserAuth],
    );

    const registerLanguageNamespace = useCallback(
        (namespace: string, fallbackStrings: Record<string, string>) => {
            setStrings(
                (prevValue) => {
                    if (isDefined(prevValue[currentLanguage]?.[namespace])) {
                        return {
                            ...prevValue,
                            [currentLanguage]: {
                                ...prevValue[currentLanguage],
                                [namespace]: {
                                    ...fallbackStrings,
                                    ...prevValue[currentLanguage]?.[namespace],
                                },
                            },
                        };
                    }

                    return {
                        ...prevValue,
                        [currentLanguage]: {
                            ...prevValue[currentLanguage],
                            [namespace]: fallbackStrings,
                        },
                    };
                },
            );
        },
        [setStrings, currentLanguage],
    );

    const setStringsForCurrentLang = useCallback<Dispatch<SetStateAction<LanguageContextProps['strings']>>>(
        (value) => {
            setStrings((oldValue) => ({
                ...oldValue,
                [currentLanguage]: typeof value === 'function'
                    ? value(oldValue[currentLanguage])
                    : value,
            }));
        },
        [currentLanguage],
    );

    const languageContextValue = useMemo<LanguageContextProps>(
        () => ({
            languageNamespaceStatus,
            setLanguageNamespaceStatus,
            currentLanguage,
            setCurrentLanguage: setAndStoreCurrentLanguage,
            strings: strings[currentLanguage] ?? baseString,
            setStrings: setStringsForCurrentLang,
            registerNamespace: registerLanguageNamespace,
        }),
        [
            languageNamespaceStatus,
            setLanguageNamespaceStatus,
            currentLanguage,
            setAndStoreCurrentLanguage,
            strings,
            registerLanguageNamespace,
            setStringsForCurrentLang,
        ],
    );

    const [alerts, setAlerts] = useState<AlertParams[]>([]);

    const addAlert = useCallback((alert: AlertParams) => {
        setAlerts((prevAlerts) => unique(
            [...prevAlerts, alert],
            (a) => a.name,
        ) ?? prevAlerts);
    }, [setAlerts]);

    const removeAlert = useCallback((name: AlertParams['name']) => {
        setAlerts((prevAlerts) => {
            const i = prevAlerts.findIndex((a) => a.name === name);
            if (i === -1) {
                return prevAlerts;
            }

            const newAlerts = [...prevAlerts];
            newAlerts.splice(i, 1);

            return newAlerts;
        });
    }, [setAlerts]);

    const updateAlert = useCallback((name: AlertParams['name'], paramsWithoutName: Omit<AlertParams, 'name'>) => {
        setAlerts((prevAlerts) => {
            const i = prevAlerts.findIndex((a) => a.name === name);
            if (i === -1) {
                return prevAlerts;
            }

            const updatedAlert = {
                ...prevAlerts[i],
                paramsWithoutName,
            };

            const newAlerts = [...prevAlerts];
            newAlerts.splice(i, 1, updatedAlert);

            return newAlerts;
        });
    }, [setAlerts]);

    const alertContextValue: AlertContextProps = useMemo(() => ({
        alerts,
        addAlert,
        updateAlert,
        removeAlert,
    }), [alerts, addAlert, updateAlert, removeAlert]);

    if (!ready) {
        return (
            // FIXME: Use translation
            <div className={styles.loading}>
                Checking user session...
            </div>
        );
    }

    return (
        <RouteContext.Provider value={wrappedRoutes}>
            <UserContext.Provider value={userContextValue}>
                <AlertContext.Provider value={alertContextValue}>
                    <LanguageContext.Provider value={languageContextValue}>
                        <RouterProvider router={router} />
                    </LanguageContext.Provider>
                </AlertContext.Provider>
            </UserContext.Provider>
        </RouteContext.Provider>
    );
}

export default App;
