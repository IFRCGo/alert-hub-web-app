import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import { Outlet } from 'react-router-dom';
import {
    Button,
    Container,
    NavigationTabList,
} from '@ifrc-go/ui';
import {
    useBooleanState,
    useTranslation,
} from '@ifrc-go/ui/hooks';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import alerthubApi from '#assets/icons/alerthub_api.svg';
import alerthubLogo from '#assets/icons/alerthub_Logo.png';
import Link from '#components/Link';
import NavigationTab from '#components/NavigationTab';
import Page from '#components/Page';
import {
    AlertFilter,
    CountryDetailQuery,
} from '#generated/types/graphql';
import useUrlSearchState from '#hooks/useUrlSearchState';
import NewSubscriptionModal from '#views/NewSubscriptionModal';

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

type DirectAlertFilterKeys = SafeExtract<AlertFilter, 'country' | 'admin1' | 'region'>;
type InfosAlertFilters = NonNullable<AlertFilter['infos']>;
type InfosAlertFilterKeys = SafeExtract<InfosAlertFilters, 'category' | 'urgency' | 'severity' | 'certainty'>;
type ApplicableAlertFilterKey = DirectAlertFilterKeys | InfosAlertFilterKeys;

type ApplicableAlertFilter = Pick<InfosAlertFilters, InfosAlertFilterKeys>
    & Pick<AlertFilter, DirectAlertFilterKeys | 'infos'>
    & {
        alert: string | undefined;
        startDateFrom: string | undefined;
        startDateTo: string | undefined;
    };

type CombinedAlertFilterKey = ApplicableAlertFilterKey | 'alert' | 'startDateFrom' | 'startDateTo';
const filterKeys: CombinedAlertFilterKey[] = ['country', 'admin1', 'region', 'urgency', 'severity', 'category', 'certainty', 'alert', 'startDateTo', 'startDateFrom'];

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    const [
        filters,
        setFilters,
    ] = useUrlSearchState<ApplicableAlertFilter, CombinedAlertFilterKey>(
        filterKeys,
        (urlValues) => {
            const category: NonNullable<ApplicableAlertFilter['infos']>['category'] = convertUrlQueryToEnumList(urlValues.category);
            const urgency: NonNullable<ApplicableAlertFilter['infos']>['urgency'] = convertUrlQueryToEnumList(urlValues.urgency);
            const severity: NonNullable<ApplicableAlertFilter['infos']>['severity'] = convertUrlQueryToEnumList(urlValues.severity);
            const certainty: NonNullable<ApplicableAlertFilter['infos']>['certainty'] = convertUrlQueryToEnumList(urlValues.certainty);

            return {
                country: isDefined(urlValues.country) ? { pk: urlValues.country } : undefined,
                admin1: convertUrlQueryToId(urlValues.admin1),
                region: convertUrlQueryToId(urlValues.region),
                infos: (isDefined(category)
                    || isDefined(urgency)
                    || isDefined(severity) || isDefined(certainty))
                    ? ({
                        category,
                        urgency,
                        severity,
                        certainty,
                    }) : undefined,
                alert: convertUrlQueryToId(urlValues.alert),
                startDateTo: convertUrlQueryToId(urlValues.startDateTo),
                startDateFrom: convertUrlQueryToId(urlValues.startDateFrom),
            };
        },
        (filterValues) => ({
            country: convertIdToUrlQuery(filterValues.country?.pk),
            admin1: convertIdToUrlQuery(filterValues.admin1),
            region: convertIdToUrlQuery(filterValues.region),
            category: convertEnumListToUrlQuery(filterValues.infos?.category),
            urgency: convertEnumListToUrlQuery(filterValues.infos?.urgency),
            severity: convertEnumListToUrlQuery(filterValues.infos?.severity),
            certainty: convertEnumListToUrlQuery(filterValues.infos?.certainty),
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
        (fieldKey: CombinedAlertFilterKey) => (
            (newValue: ApplicableAlertFilter[ApplicableAlertFilterKey]) => {
                setFilters(
                    (prevFilter) => {
                        if (fieldKey === 'category'
                            || fieldKey === 'urgency'
                            || fieldKey === 'severity'
                            || fieldKey === 'certainty'
                        ) {
                            return ({
                                ...prevFilter,
                                infos: {
                                    ...prevFilter.infos,
                                    [fieldKey]: newValue,
                                },
                            });
                        }
                        return ({
                            ...prevFilter,
                            [fieldKey]: newValue,
                        });
                    },
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

            selectedUrgencyTypes: filters.infos?.urgency ?? undefined,
            setSelectedUrgencyTypes: getFilterFieldSetterFn('urgency'),

            selectedSeverityTypes: filters.infos?.severity ?? undefined,
            setSelectedSeverityTypes: getFilterFieldSetterFn('severity'),

            selectedCertaintyTypes: filters.infos?.certainty ?? undefined,
            setSelectedCertaintyTypes: getFilterFieldSetterFn('certainty'),

            selectedCategoryTypes: filters.infos?.category ?? undefined,
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
    const defaultSubscription = useMemo(() => ({
        filterAlertUrgencies: alertContextValue.selectedUrgencyTypes,
        filterAlertCertainties: alertContextValue.selectedCertaintyTypes,
        filterAlertSeverities: alertContextValue.selectedSeverityTypes,
        filterAlertCategories: alertContextValue.selectedCategoryTypes,
        filterAlertCountry: alertContextValue.activeCountryId,
        filterAlertAdmin1s: alertContextValue.activeAdmin1Id
            ? [alertContextValue.activeAdmin1Id] : [],
    }), [alertContextValue]);

    const [showSubscriptionModal, {
        setTrue: setShowSubscriptionModalTrue,
        setFalse: setShowSubscriptionModalFalse,
    }] = useBooleanState(false);

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
                    <>
                        <Container
                            className={styles.cards}
                            contentViewType="grid"
                            numPreferredGridContentColumns={2}
                        >
                            <Container
                                className={styles.card}
                                contentViewType="grid"
                                numPreferredGridContentColumns={2}
                                childrenContainerClassName={styles.cardsContent}
                            >
                                <Container
                                    heading={strings.addSubscription}
                                    headerDescription={strings.addSubscriptionDescription}
                                    withInternalPadding
                                    footerContent={(
                                        <Button
                                            onClick={setShowSubscriptionModalTrue}
                                            name={undefined}
                                            variant="primary"
                                        >
                                            {strings.alertNewSubscription}
                                        </Button>
                                    )}
                                />
                                <Container
                                    withInternalPadding
                                >
                                    <img
                                        className={styles.alertImage}
                                        src={alerthubLogo}
                                        alt=""
                                    />
                                </Container>
                            </Container>
                            {showSubscriptionModal && (
                                <NewSubscriptionModal
                                    onCloseModal={setShowSubscriptionModalFalse}
                                    subscription={defaultSubscription}
                                    onSuccess={undefined}
                                />
                            )}
                            <Container
                                className={styles.card}
                                contentViewType="grid"
                                numPreferredGridContentColumns={2}
                                childrenContainerClassName={styles.cardsContent}
                            >
                                <Container
                                    heading={strings.useApi}
                                    headerDescription={strings.useApiDescription}
                                    withInternalPadding
                                    footerContent={(
                                        <Link
                                            href="https://github.com/IFRCGo/alert-hub-web-app/blob/develop/APIDOCS.md"
                                            external
                                            variant="primary"
                                        >
                                            {strings.alertApiReference}
                                        </Link>
                                    )}
                                />
                                <Container
                                    withInternalPadding
                                >
                                    <img
                                        className={styles.alertImage}
                                        src={alerthubApi}
                                        alt=""
                                    />
                                </Container>
                            </Container>
                        </Container>
                        <div>
                            <NavigationTabList variant="secondary">
                                <NavigationTab to="homeMap">
                                    {strings.mapTabTitle}
                                </NavigationTab>
                                <NavigationTab to="homeTable">
                                    {strings.tableTabTitle}
                                </NavigationTab>
                            </NavigationTabList>
                        </div>
                    </>
                )}

            >
                <Outlet />
            </Page>
        </AlertDataContext.Provider>
    );
}

Component.displayName = 'Home';
