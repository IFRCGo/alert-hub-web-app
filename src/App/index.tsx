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
