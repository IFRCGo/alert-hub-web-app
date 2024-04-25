import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { ArrowDropRightLineIcon } from '@ifrc-go/icons';
import { Container } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';

import {
    CountryAlertsCountQuery,
    CountryAlertsCountQueryVariables,
    CountryListQuery,
    CountryListQueryVariables,
} from '#generated/types/graphql';
import routes from '#routes';

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
    }
  }
}
`;

const COUNTRY_ALERTS_COUNT = gql`
query CountryAlertsCount {
    public {
      alerts {
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

interface Props {
    className?: string;
}

function AlertsView(props: Props) {
    const { className } = props;

    const strings = useTranslation(i18n);
    const alertFilters = useAlertFilters();

    const {
        data: countryListResponse,
        loading: countryListLoading,
        error: countryListError,
    } = useQuery<CountryListQuery, CountryListQueryVariables>(
        COUNTRY_LIST,
        { variables: { alertFilters } },
    );

    const {
        data: countryListCountResponse,
    } = useQuery<CountryAlertsCountQuery, CountryAlertsCountQueryVariables>(
        COUNTRY_ALERTS_COUNT,
    );

    const countriesWithAlert = useMemo(() => countryListResponse?.public.allCountries.filter(
        (country) => (country?.filteredAlertCount ?? 0) > 0,
    ), [countryListResponse?.public.allCountries]);

    const countryListCount = countryListCountResponse?.public?.alerts?.count;

    return (
        <Container
            className={_cs(styles.alertMap, className)}
            heading={`${strings.mapHeading} (${countryListCount})`}
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
