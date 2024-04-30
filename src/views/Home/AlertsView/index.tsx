import {
    useContext,
    useEffect,
    useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { ArrowDropRightLineIcon } from '@ifrc-go/icons';
import { Container } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { resolveToString } from '@ifrc-go/ui/utils';
import {
    _cs,
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import {
    AlertFilter,
    CountryAlertsCountQuery,
    CountryAlertsCountQueryVariables,
    CountryListQuery,
    CountryListQueryVariables,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';
import routes from '#routes';

import AlertContext from '../AlertContext';
import useAlertFilters from '../useAlertFilters';
import AlertsAside from './AlertsAside';
import AlertsMap from './AlertsMap';

import i18n from './i18n.json';
import styles from './styles.module.css';

// NOTE: alertFilters is related with filteredAlertCount
const COUNTRY_LIST = gql`
query CountryList($alertFilters: AlertFilter) {
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

interface Props {
    className?: string;
}

function AlertsView(props: Props) {
    const { className } = props;
    const strings = useTranslation(i18n);
    const alertFilters = useAlertFilters();
    const { activeCountryId, activeAdmin1Id } = useContext(AlertContext);

    const {
        filter,
        setFilter,
    } = useFilterState<AlertFilter>({
        filter: {},
    });

    useEffect(
        () => {
            setFilter({
                ...alertFilters,
                country: isDefined(activeCountryId) ? { pk: activeCountryId } : undefined,
                admin1: activeAdmin1Id,
            });
        },
        [
            alertFilters,
            activeCountryId,
            activeAdmin1Id,
            setFilter],
    );

    const {
        data: countryListResponse,
        loading: countryListLoading,
        error: countryListError,
    } = useQuery<CountryListQuery, CountryListQueryVariables>(
        COUNTRY_LIST,
        { variables: { alertFilters } },
    );

    const variables = useMemo<{ filters: AlertFilter}>(() => ({
        filters: filter,
    }), [
        filter,
    ]);

    const {
        data: countryListCountResponse,
    } = useQuery<CountryAlertsCountQuery, CountryAlertsCountQueryVariables>(
        COUNTRY_ALERTS_COUNT,
        {
            skip: isNotDefined(variables),
            variables,
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
            className={_cs(styles.alertMap, className)}
            heading={heading}
            withHeaderBorder
            childrenContainerClassName={styles.mainContent}
            actions={(
                <Link
                    className={styles.sources}
                    to={routes.allSourcesFeeds.absolutePath}
                >
                    {strings.mapViewAllSources}
                    <ArrowDropRightLineIcon className={styles.icon} />
                </Link>
            )}
            overlayPending
            pending={countryListLoading}
            errored={isDefined(countryListError)}
            errorMessage={countryListError?.message}
            contentViewType="grid"
            numPreferredGridContentColumns={3}
        >
            <AlertsMap
                className={styles.alertsMap}
                countriesWithAlert={countriesWithAlert}
            />
            <AlertsAside
                className={styles.alertsAside}
                countriesWithAlert={countriesWithAlert}
            />
        </Container>
    );
}
export default AlertsView;
