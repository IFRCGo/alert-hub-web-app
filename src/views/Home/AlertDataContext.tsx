import { createContext } from 'react';

import {
    Admin1DetailQuery,
    AlertInfoCategoryEnum,
    AlertInfoCertaintyEnum,
    AlertInfoSeverityEnum,
    AlertInfoUrgencyEnum,
    CountryDetailQuery,
} from '#generated/types/graphql';

type Id = string;
// type SetStateFn<T> = React.Dispatch<React.SetStateAction<T | undefined>>;
type SetStateFn<T> = (newValue: T | undefined) => void;

export interface AlertDataContextProps {
    activeRegionId: Id | undefined;
    setActiveRegionId: SetStateFn<Id>;

    activeCountryId: Id | undefined;
    setActiveCountryId: SetStateFn<Id>;

    activeAdmin1Id: Id | undefined;
    setActiveAdmin1Id: SetStateFn<Id>;

    activeAlertId: Id | undefined;
    setActiveAlertId: SetStateFn<Id>;

    activeCountryDetails: CountryDetailQuery | undefined;
    setActiveCountryDetails: SetStateFn<CountryDetailQuery>;

    activeAdmin1Details: Admin1DetailQuery | undefined;
    setActiveAdmin1Details: SetStateFn<CountryDetailQuery>;

    selectedUrgencyTypes: AlertInfoUrgencyEnum[] | undefined;
    setSelectedCategoryTypes: SetStateFn<AlertInfoCategoryEnum[]>;

    selectedSeverityTypes: AlertInfoSeverityEnum[] | undefined;
    setSelectedUrgencyTypes: SetStateFn<AlertInfoUrgencyEnum[]>;

    selectedCertaintyTypes: AlertInfoCertaintyEnum[] | undefined;
    setSelectedSeverityTypes: SetStateFn<AlertInfoSeverityEnum[]>;

    selectedCategoryTypes: AlertInfoCategoryEnum[] | undefined;
    setSelectedCertaintyTypes: SetStateFn<AlertInfoCertaintyEnum[]>;

    startDateFrom: string | undefined;
    setStartDateFrom: SetStateFn<string>;

    startDateTo: string |undefined;
    setStartDateTo: SetStateFn<string>;
}

function getDefaultStateFn(name: string) {
    return () => {
        // eslint-disable-next-line no-console
        console.warn(`AlertDataContext::${name} called without provider`);
    };
}

const AlertDataContext = createContext<AlertDataContextProps>({
    activeRegionId: undefined,
    setActiveRegionId: getDefaultStateFn('setActiveRegionId'),

    activeCountryId: undefined,
    setActiveCountryId: getDefaultStateFn('setActiveCountryId'),

    activeAdmin1Id: undefined,
    setActiveAdmin1Id: getDefaultStateFn('setActiveAdmin1Id'),

    activeAlertId: undefined,
    setActiveAlertId: getDefaultStateFn('setActiveAlertId'),

    activeCountryDetails: undefined,
    setActiveCountryDetails: getDefaultStateFn('setActiveCountryDetails'),

    activeAdmin1Details: undefined,
    setActiveAdmin1Details: getDefaultStateFn('setActiveAdmin1Details'),

    selectedUrgencyTypes: undefined,
    setSelectedUrgencyTypes: getDefaultStateFn('setSelectedUrgencyTypes'),

    selectedSeverityTypes: undefined,
    setSelectedSeverityTypes: getDefaultStateFn('setSelectedSeverityTypes'),

    selectedCertaintyTypes: undefined,
    setSelectedCertaintyTypes: getDefaultStateFn('setSelectedCertaintyTypes'),

    selectedCategoryTypes: undefined,
    setSelectedCategoryTypes: getDefaultStateFn('setSelectedCategoryTypes'),

    startDateFrom: undefined,
    setStartDateFrom: getDefaultStateFn('setStartDateFrom'),

    startDateTo: undefined,
    setStartDateTo: getDefaultStateFn('setStartDateTo'),
});

export default AlertDataContext;
