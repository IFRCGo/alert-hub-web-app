import {
    useEffect,
    useMemo,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { ChevronRightLineIcon } from '@ifrc-go/icons';
import { Container } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
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
      alertCount
    }
  }
}
`;

const COUNTRY_ALERTS_COUNT = gql`
query CountryAlertsCount ($filters: AlertFilter){
    public{
        id
      alerts(filters: $filters) {
        count
        items {
            country {
                id
                name
                alertCount
            }
        }
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
        data: countryListResponse,
        loading: countryListLoading,
        error: countryListError,
    } = useQuery<FilteredCountryListQuery, FilteredCountryListQueryVariables>(
        FILTERED_COUNTRY_LIST,
        { variables: { alertFilters: filter } },
    );

    const alertQueryVariables = useMemo<{ filters: AlertFilter}>(() => ({
        filters: filter,
    }), [
        filter,
    ]);

    const {
        data: countryListCountResponse,
    } = useQuery<CountryAlertsCountQuery, CountryAlertsCountQueryVariables>(
        COUNTRY_ALERTS_COUNT,
        {
            skip: isNotDefined(alertQueryVariables),
            variables: alertQueryVariables,
        },
    );

    const countriesWithAlert = useMemo(() => countryListResponse?.public.allCountries.filter(
        (country) => (country?.filteredAlertCount ?? 0) > 0,
    ), [countryListResponse?.public.allCountries]);

    const countryListCount = countryListCountResponse?.public?.alerts?.count;

    const heading = resolveToString(
        strings.mapHeading,
        { numAppeals: countryListCount ?? '--' },
    );

    return (
        <Container
            className={styles.alertsMap}
            heading={heading}
            withHeaderBorder
            childrenContainerClassName={styles.mainContent}
            actions={(
                <Link
                    className={styles.sources}
                    to="allSourcesFeeds"
                    actions={(
                        <ChevronRightLineIcon className={styles.icon} />
                    )}
                >
                    {strings.mapViewAllSources}
                </Link>
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
