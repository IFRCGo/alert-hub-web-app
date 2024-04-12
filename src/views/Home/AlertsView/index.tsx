import { Link } from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { Container } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { _cs } from '@togglecorp/fujs';

import {
    CountryListQuery,
    CountryListQueryVariables,
} from '#generated/types/graphql';

import AlertsAside from './AlertsAside';
import AlertsMap from './AlertsMap';

import i18n from './i18n.json';
import styles from './styles.module.css';

const COUNTRIES_LIST = gql`
query CountryList {
  public {
    allCountries(alertFilters: {}) {
      name
      id
      iso3
      filteredAlertCount
    }
  }
}
`;

export type AlertPointFeature = GeoJSON.Feature<GeoJSON.Point, AlertPointProperties>;

type AlertPointProperties = {
    id: string | number,
}

interface Props {
    className?: string;
}

function AlertsView(props: Props) {
    const { className } = props;

    const strings = useTranslation(i18n);

    const {
        data: countryResponse,
        loading: countryLoading,
    } = useQuery<CountryListQuery, CountryListQueryVariables>(
        COUNTRIES_LIST,
    );

    const countriesWithAlert = countryResponse?.public.allCountries.filter(
        (country) => (country?.filteredAlertCount ?? 0) > 0,
    );

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
            />
            <AlertsAside
                className={styles.alertsAside}
                countriesWithAlert={countriesWithAlert}
                alertsFiltered={false} // NOTE: set this when the data is filtered
                alertsPending={countryLoading}
                alertsFetchError={false} // NOTE: set this on error
            />
        </Container>
    );
}

export default AlertsView;
