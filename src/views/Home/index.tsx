import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import { Outlet } from 'react-router-dom';
import { NavigationTabList } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import NavigationTab from '#components/NavigationTab';
import Page from '#components/Page';
import {
    AlertFilter,
    CountryDetailQuery,
} from '#generated/types/graphql';
import useUrlSearchState from '#hooks/useUrlSearchState';

import AlertDataContext, { AlertDataContextProps } from './AlertDataContext';

import i18n from './i18n.json';
import styles from './styles.module.css';

export type TabKeys = 'map' | 'table';

const ARRAY_SPLITTER = '.';

function convertUrlQueryToEnumList<ENUM_TYPE>(urlQuery: string | undefined | null) {
    if (isNotDefined(urlQuery)) {
        return undefined;
    }

    const list = urlQuery.split(ARRAY_SPLITTER);

    return list as ENUM_TYPE[];
}

function convertEnumListToUrlQuery<ENUM_TYPE>(list: ENUM_TYPE[] | undefined | null) {
    if (isNotDefined(list) || list.length === 0) {
        return undefined;
    }

    return list.toSorted().join(ARRAY_SPLITTER);
}

function convertUrlQueryToId(urlQuery: string | undefined | null) {
    return urlQuery ?? undefined;
}

function convertIdToUrlQuery(urlQuery: string | undefined | null) {
    return urlQuery;
}

type SafeExtract<T, X extends keyof T> = Extract<keyof T, X>;
type ApplicableAlertFilterKey = SafeExtract<AlertFilter, 'country' | 'admin1' | 'urgency' | 'region' | 'severity' | 'category' | 'certainty'>;

type ApplicableAlertFilter = Pick<AlertFilter, ApplicableAlertFilterKey> & {
    alert: string | undefined;
    startDateFrom: string | undefined;
    startDateTo: string | undefined;
};

type CompbinedAlertFilterKey = ApplicableAlertFilterKey | 'alert' | 'startDateFrom' | 'startDateTo';
const filterKeys: CompbinedAlertFilterKey[] = ['country', 'admin1', 'urgency', 'region', 'severity', 'category', 'certainty', 'alert', 'startDateTo', 'startDateFrom'];

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    const [
        filters,
        setFilters,
    ] = useUrlSearchState<ApplicableAlertFilter, CompbinedAlertFilterKey>(
        filterKeys,
        (urlValues) => ({
            country: isDefined(urlValues.country) ? { pk: urlValues.country } : undefined,
            admin1: convertUrlQueryToId(urlValues.admin1),
            region: convertUrlQueryToId(urlValues.region),
            category: convertUrlQueryToEnumList(urlValues.category),
            urgency: convertUrlQueryToEnumList(urlValues.urgency),
            severity: convertUrlQueryToEnumList(urlValues.severity),
            certainty: convertUrlQueryToEnumList(urlValues.certainty),
            alert: convertUrlQueryToId(urlValues.alert),
            startDateTo: convertUrlQueryToId(urlValues.startDateTo),
            startDateFrom: convertUrlQueryToId(urlValues.startDateFrom),
        }),
        (filterValues) => ({
            country: convertIdToUrlQuery(filterValues.country?.pk),
            admin1: convertIdToUrlQuery(filterValues.admin1),
            region: convertIdToUrlQuery(filterValues.region),
            category: convertEnumListToUrlQuery(filterValues.category),
            urgency: convertEnumListToUrlQuery(filterValues.urgency),
            severity: convertEnumListToUrlQuery(filterValues.severity),
            certainty: convertEnumListToUrlQuery(filterValues.certainty),
            alert: convertUrlQueryToId(filterValues.alert),
            startDateTo: convertUrlQueryToId(filterValues.startDateTo),
            startDateFrom: convertUrlQueryToId(filterValues.startDateFrom),
        }),
    );

    const [activeCountryDetails, setActiveCountryDetails] = useState<CountryDetailQuery>();
    const [activeAdmin1Details, setActiveAdmin1Details] = useState<CountryDetailQuery>();

    const setActiveCountryIdSafe = useCallback(
        (countryId: string | undefined) => {
            setFilters(
                (prevValue) => ({
                    ...prevValue,
                    country: isDefined(countryId) ? { pk: countryId } : undefined,
                    admin1: undefined,
                    alert: undefined,
                }),
            );

            setActiveCountryDetails(undefined);
            setActiveAdmin1Details(undefined);
        },
        [setFilters],
    );

    const getFilterFieldSetterFn = useCallback(
        (fieldKey: CompbinedAlertFilterKey) => (
            (newValue: ApplicableAlertFilter[ApplicableAlertFilterKey]) => {
                setFilters(
                    (prevFilter) => ({
                        ...prevFilter,
                        [fieldKey]: newValue,
                    }),
                );
            }
        ),
        [setFilters],
    );

    const alertContextValue = useMemo<AlertDataContextProps>(
        () => ({
            activeAlertId: filters.alert,
            setActiveAlertId: getFilterFieldSetterFn('alert'),

            activeRegionId: filters.region ?? undefined,
            setActiveRegionId: getFilterFieldSetterFn('region'),

            activeCountryId: filters.country?.pk,
            setActiveCountryId: setActiveCountryIdSafe,

            activeAdmin1Id: filters.admin1 ?? undefined,
            setActiveAdmin1Id: getFilterFieldSetterFn('admin1'),

            activeCountryDetails: isDefined(filters.country) ? activeCountryDetails : undefined,
            setActiveCountryDetails,

            activeAdmin1Details: isDefined(filters.admin1) ? activeAdmin1Details : undefined,
            setActiveAdmin1Details,

            selectedUrgencyTypes: filters.urgency ?? undefined,
            setSelectedUrgencyTypes: getFilterFieldSetterFn('urgency'),

            selectedSeverityTypes: filters.severity ?? undefined,
            setSelectedSeverityTypes: getFilterFieldSetterFn('severity'),

            selectedCertaintyTypes: filters.certainty ?? undefined,
            setSelectedCertaintyTypes: getFilterFieldSetterFn('certainty'),

            selectedCategoryTypes: filters.category ?? undefined,
            setSelectedCategoryTypes: getFilterFieldSetterFn('category'),

            startDateFrom: filters.startDateFrom,
            setStartDateFrom: getFilterFieldSetterFn('startDateFrom'),

            startDateTo: filters.startDateTo,
            setStartDateTo: getFilterFieldSetterFn('startDateTo'),
        }),
        [
            filters,
            activeAdmin1Details,
            activeCountryDetails,
            setActiveCountryIdSafe,
            getFilterFieldSetterFn,
        ],
    );

    return (
        <AlertDataContext.Provider value={alertContextValue}>
            <Page
                title={strings.homeTitle}
                className={styles.home}
                heading={strings.homeHeading}
                description={strings.homeDescription}
                infoContainerClassName={styles.tabSection}
                mainSectionClassName={styles.content}
                info={(
                    <NavigationTabList variant="secondary">
                        <NavigationTab to="homeMap">
                            {strings.mapTabTitle}
                        </NavigationTab>
                        <NavigationTab to="homeTable">
                            {strings.tableTabTitle}
                        </NavigationTab>
                    </NavigationTabList>
                )}
            >
                <Outlet />
            </Page>
        </AlertDataContext.Provider>
    );
}

Component.displayName = 'Home';
