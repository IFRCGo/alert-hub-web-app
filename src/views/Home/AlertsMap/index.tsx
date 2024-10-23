import {
    useContext,
    useEffect,
    useMemo,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    AddLineIcon,
    ChevronRightLineIcon,
} from '@ifrc-go/icons';
import {
    Button,
    Container,
    InfoPopup,
} from '@ifrc-go/ui';
import {
    useBooleanState,
    useTranslation,
} from '@ifrc-go/ui/hooks';
import { resolveToString } from '@ifrc-go/ui/utils';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import Link from '#components/Link';
import {
    AlertFilter,
    CountryAlertsCountQuery,
    CountryAlertsCountQueryVariables,
    FilteredCountryListQuery,
    FilteredCountryListQueryVariables,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';
import NewSubscriptionModal from '#views/NewSubscriptionModal';

import AlertDataContext from '../AlertDataContext';
import AlertFilters from '../AlertFilters';
import useAlertFilters from '../useAlertFilters';
import Map from './Map';
import Sidebar from './Sidebar';

import i18n from './i18n.json';
import styles from './styles.module.css';

// NOTE: alertFilters is related with filteredAlertCount
const FILTERED_COUNTRY_LIST = gql`
    query FilteredCountryList($alertFilters: AlertFilter) {
        public {
            id
            allCountries(alertFilters: $alertFilters) {
                name
                id
                iso3
                filteredAlertCount
                ifrcGoId
            }
        }
    }
`;

// FIXME: Rename this to FilteredAlertList
const COUNTRY_ALERTS_COUNT = gql`
query CountryAlertsCount($filters: AlertFilter){
        public {
            id
            alerts(filters: $filters) {
                count
            }
        }
    }
`;

export type AlertPointFeature = GeoJSON.Feature<GeoJSON.Point, AlertPointProperties>;
export type TabKeys = 'admin1' | 'alert';

type AlertPointProperties = {
    id: string | number,
}

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);
    const alertFilters = useAlertFilters();

    const [showSubscriptionModal, {
        setTrue: setShowSubscriptionModalTrue,
        setFalse: setShowSubscriptionModalFalse,
    }] = useBooleanState(false);

    const {
        activeAdmin1Id,
        activeCountryId,
        activeAlertId,
        activeCountryDetails,
        activeAdmin1Details,
        selectedUrgencyTypes,
        selectedCertaintyTypes,
        selectedSeverityTypes,
    } = useContext(AlertDataContext);

    // FIXME: We should remove useFilterState as we are not using any feature
    // from useFilterState
    const {
        filter,
        setFilter,
    } = useFilterState<AlertFilter>({
        filter: {},
    });

    useEffect(
        () => {
            setFilter(alertFilters);
        },
        [
            alertFilters,
            setFilter,
        ],
    );

    const {
        previousData,
        data: countryListResponse = previousData,
        loading: countryListLoading,
        error: countryListError,
    } = useQuery<FilteredCountryListQuery, FilteredCountryListQueryVariables>(
        FILTERED_COUNTRY_LIST,
        {
            variables: {
                alertFilters: {
                    ...filter,
                    // NOTE: We do not need to filter country list by country/admin1 filter
                    country: undefined,
                    admin1: undefined,
                },
            },
            skip: isDefined(activeAdmin1Id)
                || isDefined(activeAlertId)
                || isDefined(activeCountryId),
        },
    );

    const alertQueryVariables = useMemo<{ filters: AlertFilter }>(() => ({
        filters: filter,
    }), [
        filter,
    ]);

    const {
        previousData: previousCountryListCountResponse,
        data: countryListCountResponse = previousCountryListCountResponse,
    } = useQuery<CountryAlertsCountQuery, CountryAlertsCountQueryVariables>(
        COUNTRY_ALERTS_COUNT,
        {
            skip: isNotDefined(alertQueryVariables)
                || isDefined(activeAdmin1Id)
                || isDefined(activeCountryId)
                || isDefined(activeAlertId),
            variables: alertQueryVariables,
        },
    );

    const countriesWithAlert = useMemo(() => countryListResponse?.public.allCountries.filter(
        (country) => (country?.filteredAlertCount ?? 0) > 0,
    ), [countryListResponse?.public.allCountries]);

    const totalAlertCount = countryListCountResponse?.public?.alerts?.count;

    const heading = useMemo(
        () => {
            let count = totalAlertCount ?? '--';

            if (isDefined(activeAdmin1Details)) {
                count = activeAdmin1Details.public.admin1?.alertCount ?? '--';
            } else if (isDefined(activeCountryDetails)) {
                count = activeCountryDetails.public.country?.alertCount ?? '--';
            }

            return resolveToString(
                strings.mapHeading,
                { numAlerts: count },
            );
        },
        [totalAlertCount, activeCountryDetails, activeAdmin1Details, strings],
    );

    const defaultSubscription = useMemo(() => ({
        id: '',
        title: '',
        urgency: selectedUrgencyTypes,
        severity: selectedSeverityTypes,
        certainty: selectedCertaintyTypes,
        country: activeCountryId,
        admin1: activeAdmin1Id,
    }), [
        selectedUrgencyTypes,
        selectedSeverityTypes,
        selectedCertaintyTypes,
        activeCountryId,
        activeAdmin1Id,
    ]);

    return (
        <Container
            className={styles.alertsMap}
            heading={(
                <div className={styles.alertInfo}>
                    {heading}
                    <InfoPopup
                        className={styles.alertIcon}
                        description={strings.alertInfo}
                    />
                </div>
            )}
            withHeaderBorder
            childrenContainerClassName={styles.mainContent}
            actions={(
                <div className={styles.links}>
                    <Button
                        className={styles.sources}
                        onClick={setShowSubscriptionModalTrue}
                        name={undefined}
                        variant="tertiary"
                        actions={(
                            <AddLineIcon
                                className={styles.icon}
                            />
                        )}
                    >
                        {strings.alertNewSubscription}
                    </Button>
                    <Link
                        className={styles.sources}
                        to="allSourcesFeeds"
                        actions={(
                            <ChevronRightLineIcon className={styles.icon} />
                        )}
                    >
                        {strings.mapViewAllSources}
                    </Link>
                </div>
            )}
            overlayPending
            pending={countryListLoading}
            errored={isDefined(countryListError)}
            errorMessage={countryListError?.message}
            contentViewType="grid"
            numPreferredGridContentColumns={3}
            filters={<AlertFilters variant="map" />}
            withGridViewInFilter
        >
            {showSubscriptionModal && (
                <NewSubscriptionModal
                    subscription={defaultSubscription}
                    onCloseModal={setShowSubscriptionModalFalse}
                />
            )}
            <Map
                className={styles.alertsMap}
                countriesWithAlert={countriesWithAlert}
            />
            <Sidebar
                className={styles.alertsAside}
                countriesWithAlert={countriesWithAlert}
            />
        </Container>
    );
}
