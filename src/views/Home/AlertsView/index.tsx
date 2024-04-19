import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import { Link } from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { Container } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';

import {
    Admin1AlertListQuery,
    Admin1AlertListQueryVariables,
    Admin1ListQuery,
    Admin1ListQueryVariables,
    AlertInfoQuery,
    AlertInfoQueryVariables,
    CountryAlertsListQuery,
    CountryAlertsListQueryVariables,
    CountryListQuery,
    CountryListQueryVariables,
} from '#generated/types/graphql';

import AlertsAside from './AlertsAside';
import AlertsMap from './AlertsMap';

import i18n from './i18n.json';
import styles from './styles.module.css';

// NOTE: alertFilters is related with filteredAlertCount
const COUNTRIES_LIST = gql`
query CountryList {
  public {
    allCountries(alertFilters: {}) {
      name
      id
      iso3
      filteredAlertCount
      bbox
    }
  }
}
`;

const ADMIN1_LIST = gql`
query Admin1List {
    public {
        admin1s(filters: {}) {
          items {
            countryId
            alertCount
            name
            id
            bbox
          }
        }
    }
  }
`;

const COUNTRY_ALERTS_LIST = gql`
  query CountryAlertsList(
    $country: ID!,
    $pagination: OffsetPaginationInput
    ) {
    public {
      alerts(
        filters: {
         country: {
            pk: $country
            }
        }
        pagination: $pagination
        ) {
            items {
                infos {
                  event
                  category
                  headline
                  onset
                  severityDisplay
                }
                id
                info {
                  event
                  category
                }
            }
        limit
        offset 
        count
      }
    }
  }
`;

const ALERT_INFO = gql`
query AlertInfo($alert: ID!) {
    public {
      alert(pk: $alert) {
        info {
          event
          categoryDisplay
          category
          language
          responseType
          responseTypeDisplay
          urgencyDisplay
          severityDisplay
          certaintyDisplay
          id
        }
        infos {
            id
            language
            event
            urgencyDisplay
            severityDisplay
            responseTypeDisplay
            certaintyDisplay
            parameters {
              id
              value
              valueName
            }
            parameter
            areas {
              polygons {
                value
                id
                alertInfoAreaId
              }
              id
            }
          }
        sender
        sent
        admin1s {
          isUnknown
        }
        url
        identifier
        scope
        restriction
        references
      }
    }
  }
`;

const ADMIN1_ALERT_LIST = gql`
query Admin1AlertList(
    $admin: ID!,
    $pagination: OffsetPaginationInput
) {
    public {
      alerts(filters: {
        admin1: $admin
    }, pagination: $pagination) {
        items {
          id
          info {
            id
            event
            description
          }
          admin1s {
            bbox
            id
          }
        }
        limit
        offset
        count
      }
    }
  }
`;

export type AlertPointFeature = GeoJSON.Feature<GeoJSON.Point, AlertPointProperties>;
export type TabKeys = 'admin1' | 'alert';

const defaultMaxItemsPerPage = 15;

type AlertPointProperties = {
    id: string | number,
}

interface Props {
    className?: string;
}

function AlertsView(props: Props) {
    const { className } = props;

    const strings = useTranslation(i18n);

    const [activeCountryId, setActiveCountryId] = useState<string | undefined>(undefined);
    const [activeAlertId, setActiveAlertId] = useState<string | undefined>(undefined);
    const [activePage, setActivePage] = useState(1);
    const [activeAdmin1Id, setActiveAdmin1Id] = useState<string | undefined>(undefined);

    const {
        data: countryResponse,
        loading: countryLoading,
        error: countryError,
    } = useQuery<CountryListQuery, CountryListQueryVariables>(
        COUNTRIES_LIST,
    );

    const {
        data: admin1Response,
    } = useQuery<Admin1ListQuery, Admin1ListQueryVariables>(
        ADMIN1_LIST,
    );

    const variables = useMemo(() => {
        const countryId = activeCountryId ?? '';
        return {
            country: countryId,
            pagination: {
                offset: (activePage - 1) * defaultMaxItemsPerPage,
                limit: defaultMaxItemsPerPage,
            },
            alert: activeAlertId,
        };
    }, [
        activePage,
        activeCountryId,
        activeAlertId,
    ]);

    const {
        data: countryAlertsResponse,
        loading: countryAlertsLoading,
    } = useQuery<CountryAlertsListQuery, CountryAlertsListQueryVariables>(
        COUNTRY_ALERTS_LIST,
        {
            variables,
        },
    );

    const {
        data: admin1AlertsListResponse,
    } = useQuery<Admin1AlertListQuery, Admin1AlertListQueryVariables>(
        ADMIN1_ALERT_LIST,
        {
            variables: { admin: activeAdmin1Id },
        },
    );

    const {
        data: alertInfoResponse,
    } = useQuery<AlertInfoQuery, AlertInfoQueryVariables>(
        ALERT_INFO,
        {
            variables: { alert: activeAlertId },
        },
    );

    const setActiveCountryIdSafe = useCallback((countryId: string | number | undefined) => {
        const countryIdSafe = countryId as string | undefined;
        setActiveCountryId(countryIdSafe);
    }, [setActiveCountryId]);

    const countriesWithAlert = useMemo(() => countryResponse?.public.allCountries.filter(
        (country) => (country?.filteredAlertCount ?? 0) > 0,
    ), [countryResponse?.public.allCountries]);

    const activeCountry = useMemo(() => {
        if (isDefined(activeCountryId) && countriesWithAlert) {
            return countriesWithAlert.find((country) => country.id === activeCountryId);
        }
        return undefined;
    }, [
        activeCountryId,
        countriesWithAlert,
    ]);

    const activeAdmin1 = useMemo(() => {
        if (isDefined(activeAdmin1Id) && admin1AlertsListResponse?.public?.alerts?.items) {
            return admin1AlertsListResponse?.public?.alerts?.items?.find(
                (admin) => admin.id === activeAlertId,
            );
        }
        return undefined;
    }, [
        activeAdmin1Id,
        admin1AlertsListResponse,
    ]);

    const setActiveAlertIdSafe = useCallback((alertId: string | number | undefined) => {
        const alertIdSafe = alertId as string | undefined;
        setActiveAlertId(alertIdSafe);
    }, [setActiveAlertId]);

    const totalAlertCount = countryAlertsResponse?.public.alerts.count ?? 0;
    const admin1AlertCount = admin1AlertsListResponse?.public?.alerts?.count ?? 0;

    return (
        <Container
            className={_cs(styles.alertMap, className)}
            heading={strings.mapHeading}
            withHeaderBorder
            childrenContainerClassName={styles.mainContent}
            actions={(
                // TODO: Add sources link
                <Link
                    className={styles.sources}
                    to="/"
                >
                    {strings.mapViewAllSources}
                </Link>
            )}
        >
            <AlertsMap
                className={styles.alertsMap}
                countriesWithAlert={countriesWithAlert}
                countryBbox={activeCountry?.bbox}
            />
            <AlertsAside
                className={styles.alertsAside}
                countriesWithAlert={countriesWithAlert}
                alertsFiltered={false} // NOTE: set this when the data is filtered
                alertsPending={countryLoading || countryAlertsLoading}
                alertsFetchError={!!countryError} // NOTE: set this on error
                handleCountryClick={setActiveCountryIdSafe}
                activeCountryId={activeCountryId}
                activeCountryName={activeCountry?.name}
                countryAlerts={countryAlertsResponse?.public.alerts?.items}
                activePage={activePage}
                setActivePage={setActivePage}
                totalAlertCount={totalAlertCount}
                activeAlertId={activeAlertId}
                activeAdmin1Id={activeAdmin1Id}
                setActiveAdmin1Id={setActiveAdmin1Id}
                handleAlertClick={setActiveAlertIdSafe}
                admin1AlertCount={admin1AlertCount}
                admin1Alerts={admin1AlertsListResponse?.public?.alerts.items}
                alertInfo={alertInfoResponse?.public?.alert}
            />
        </Container>
    );
}

export default AlertsView;
