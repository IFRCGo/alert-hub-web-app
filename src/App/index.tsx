import {
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
import { KEY_LANGUAGE_STORAGE } from '#utils/constants';
import {
    getFromStorage,
    setToStorage,
} from '#utils/localStorage';

import wrappedRoutes, { unwrappedRoutes } from './routes';

const router = createBrowserRouter(unwrappedRoutes);
mapboxgl.accessToken = mapboxToken;

function App() {
    const [strings, setStrings] = useState<LanguageContextProps['strings']>({});
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
    const [
        languageNamespaceStatus,
        setLanguageNamespaceStatus,
    ] = useState<Record<string, LanguageNamespaceStatus>>({});

    useEffect(() => {
        const language = getFromStorage<Language>(KEY_LANGUAGE_STORAGE);
        setCurrentLanguage(language ?? 'en');
    }, []);

    const setAndStoreCurrentLanguage = useCallback(
        (newLanugage: Language) => {
            setCurrentLanguage(newLanugage);
            setToStorage(KEY_LANGUAGE_STORAGE, newLanugage);
        },
        [],
    );

    const registerLanguageNamespace = useCallback(
        (namespace: string, fallbackStrings: Record<string, string>) => {
            setStrings(
                (prevValue) => {
                    if (isDefined(prevValue[namespace])) {
                        return {
                            ...prevValue,
                            [namespace]: {
                                ...fallbackStrings,
                                ...prevValue[namespace],
                            },
                        };
                    }

                    return {
                        ...prevValue,
                        [namespace]: fallbackStrings,
                    };
                },
            );

            setLanguageNamespaceStatus((prevValue) => {
                if (isDefined(prevValue[namespace])) {
                    return prevValue;
                }

                return {
                    ...prevValue,
                    // NOTE: This will fetch if the data is not already fetched
                    [namespace]: prevValue[namespace] === 'fetched' ? 'fetched' : 'queued',
                };
            });
        },
        [setStrings],
    );

    const languageContextValue = useMemo<LanguageContextProps>(
        () => ({
            languageNamespaceStatus,
            setLanguageNamespaceStatus,
            currentLanguage,
            setCurrentLanguage: setAndStoreCurrentLanguage,
            strings,
            setStrings,
            registerNamespace: registerLanguageNamespace,
        }),
        [
            languageNamespaceStatus,
            setLanguageNamespaceStatus,
            currentLanguage,
            setAndStoreCurrentLanguage,
            strings,
            registerLanguageNamespace,
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

    return (
        <RouteContext.Provider value={wrappedRoutes}>
            <AlertContext.Provider value={alertContextValue}>
                <LanguageContext.Provider value={languageContextValue}>
                    <RouterProvider router={router} />
                </LanguageContext.Provider>
            </AlertContext.Provider>
        </RouteContext.Provider>
    );
}

export default App;
