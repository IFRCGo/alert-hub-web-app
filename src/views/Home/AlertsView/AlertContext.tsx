import { createContext } from 'react';

type Id = string;
// type SetStateFn<T> = React.Dispatch<React.SetStateAction<T | undefined>>;
type SetStateFn<T> = (newValue: T | undefined) => void;

export interface AlertContextProps {
    bbox: unknown;
    setBbox: SetStateFn<unknown>;
    activeCountryName: string | undefined;

    activeCountryId: Id | undefined;
    activeAdmin1Id: Id | undefined;
    activeAlertId: Id | undefined;

    activeGoCountryId: Id | undefined;
    activeGoAdmin1Id: Id | undefined;

    setActiveCountryId: SetStateFn<Id>;
    setActiveAdmin1Id: SetStateFn<Id>;

    setActiveGoCountryId: SetStateFn<Id>;
    setActiveGoAdmin1Id: SetStateFn<Id>;

    setActiveAlertId: SetStateFn<Id>;
    setActiveCountryName: SetStateFn<string>;
}

const AlertContext = createContext<AlertContextProps>({
    bbox: undefined,
    activeCountryId: undefined,
    activeGoCountryId: undefined,
    activeCountryName: undefined,
    activeAdmin1Id: undefined,
    activeGoAdmin1Id: undefined,
    activeAlertId: undefined,
    setBbox: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setBbox called without provider');
    },
    setActiveAdmin1Id: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setActiveAlertId called without provider');
    },
    setActiveGoAdmin1Id: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setActiveGoAlertId called without provider');
    },
    setActiveGoCountryId: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setActiveGoCountryId called without provider');
    },
    setActiveCountryId: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setActiveCountryId called without provider');
    },
    setActiveAlertId: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setActiveAlertId called without provider');
    },
    setActiveCountryName: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setActiveCountryName called without provider');
    },
});

export default AlertContext;
