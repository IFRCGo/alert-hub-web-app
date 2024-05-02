import { createContext } from 'react';

import {
    AlertInfoCategoryEnum,
    AlertInfoCertaintyEnum,
    AlertInfoSeverityEnum,
    AlertInfoUrgencyEnum,
} from '#generated/types/graphql';

type Id = string;
// type SetStateFn<T> = React.Dispatch<React.SetStateAction<T | undefined>>;
type SetStateFn<T> = (newValue: T | undefined) => void;

export interface AlertContextProps {
    bbox: unknown;
    setBbox: SetStateFn<unknown>;
    activeCountryName: string | undefined;

    activeRegionId: Id | undefined;
    activeCountryId: Id | undefined;
    activeAdmin1Id: Id | undefined;
    activeAlertId: Id | undefined;

    activeGoCountryId: Id | undefined;
    activeGoAdmin1Id: Id | undefined;

    startDateFrom: string | undefined;
    startDateTo: string |undefined;

    setActiveRegionId: SetStateFn<Id>;
    setActiveCountryId: SetStateFn<Id>;
    setActiveAdmin1Id: SetStateFn<Id>;

    setActiveGoCountryId: SetStateFn<Id>;
    setActiveGoAdmin1Id: SetStateFn<Id>;
    setActiveAlertId: SetStateFn<Id>;
    setActiveCountryName: SetStateFn<string>;

    setStartDateFrom: SetStateFn<string>;
    setStartDateTo: SetStateFn<string>;

    selectedUrgencyTypes: AlertInfoUrgencyEnum[] | undefined;
    selectedSeverityTypes: AlertInfoSeverityEnum[] | undefined;
    selectedCertaintyTypes: AlertInfoCertaintyEnum[] | undefined;
    selectedCategoryTypes: AlertInfoCategoryEnum[] | undefined;

    setSelectedCategoryTypes: SetStateFn<AlertInfoCategoryEnum[]>;
    setSelectedUrgencyTypes: SetStateFn<AlertInfoUrgencyEnum[]>;
    setSelectedSeverityTypes: SetStateFn<AlertInfoSeverityEnum[]>;
    setSelectedCertaintyTypes: SetStateFn<AlertInfoCertaintyEnum[]>;
}

const AlertContext = createContext<AlertContextProps>({
    bbox: undefined,
    activeCountryId: undefined,
    activeGoCountryId: undefined,
    activeRegionId: undefined,
    activeCountryName: undefined,
    activeAdmin1Id: undefined,
    activeGoAdmin1Id: undefined,
    activeAlertId: undefined,
    selectedUrgencyTypes: undefined,
    selectedSeverityTypes: undefined,
    selectedCertaintyTypes: undefined,
    selectedCategoryTypes: undefined,
    startDateFrom: undefined,
    startDateTo: undefined,

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
    setActiveRegionId: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setActiveRegionId called without provider');
    },
    setActiveAlertId: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setActiveAlertId called without provider');
    },
    setActiveCountryName: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setActiveCountryName called without provider');
    },
    setSelectedUrgencyTypes: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setSelectedUrgencyTypes called without provider');
    },
    setSelectedSeverityTypes: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setSelectedSeverityTypes called without provider');
    },
    setSelectedCertaintyTypes: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setSelectedCertaintyTypes called without provider');
    },
    setSelectedCategoryTypes: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setSelectedCategoryTypes called without provider');
    },
    setStartDateFrom: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setStartDateFrom called without provider');
    },
    setStartDateTo: () => {
        // eslint-disable-next-line no-console
        console.warn('AlertContext::setStartDateTo called without provider');
    },
});

export default AlertContext;
