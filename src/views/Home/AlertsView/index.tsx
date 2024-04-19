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
    isNotDefined,
} from '@togglecorp/fujs';

import {
    CountryListQuery,
    CountryListQueryVariables,
} from '#generated/types/graphql';

import AlertContext, { AlertContextProps } from './AlertContext';
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
      ifrcGoId
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

    const [activeCountryId, setActiveCountryId] = useState<string | undefined>(undefined);
    const [activeGoCountryId, setActiveGoCountryId] = useState<string | undefined>(undefined);
    const [activeAlertId, setActiveAlertId] = useState<string | undefined>(undefined);
    const [activeAdmin1Id, setActiveAdmin1Id] = useState<string | undefined>(undefined);
    const [activeGoAdmin1Id, setActiveGoAdmin1Id] = useState<string | undefined>(undefined);

    const {
        data: countryListResponse,
        loading: countryListLoading,
        error: countryListError,
    } = useQuery<CountryListQuery, CountryListQueryVariables>(
        COUNTRIES_LIST,
    );

    const countriesWithAlert = useMemo(() => countryListResponse?.public.allCountries.filter(
        (country) => (country?.filteredAlertCount ?? 0) > 0,
    ), [countryListResponse?.public.allCountries]);

    const [bbox, setBbox] = useState<unknown | undefined>();
    const [activeCountryName, setActiveCountryName] = useState<string | undefined>();

    const setActiveCountryIdSafe = useCallback(
        (countryId: string | undefined) => {
            setActiveCountryId(countryId);
            setActiveCountryName(undefined);
            setActiveAlertId(undefined);
            setActiveAdmin1Id(undefined);
            setActiveGoAdmin1Id(undefined);
            setActiveGoCountryId(undefined);
            if (isNotDefined(countryId)) {
                setBbox(undefined);
            }
        },
        [],
    );

    const alertContextValue = useMemo<AlertContextProps>(
        () => ({
            bbox,
            setBbox,
            activeAlertId,
            activeCountryId,
            activeCountryName,
            activeAdmin1Id,
            activeGoAdmin1Id,
            activeGoCountryId,
            setActiveAlertId,
            setActiveGoCountryId,
            setActiveGoAdmin1Id,
            setActiveCountryId: setActiveCountryIdSafe,
            setActiveAdmin1Id,
            setActiveCountryName,
        }),
        [
            bbox,
            activeCountryName,
            activeAlertId,
            activeGoCountryId,
            activeGoAdmin1Id,
            activeAdmin1Id,
            activeCountryId,
            setActiveCountryIdSafe,
        ],
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
            pending={countryListLoading}
            errored={isDefined(countryListError)}
            errorMessage={countryListError?.message}
            contentViewType="grid"
            numPreferredGridContentColumns={3}
        >
            <AlertContext.Provider value={alertContextValue}>
                <AlertsMap
                    className={styles.alertsMap}
                    countriesWithAlert={countriesWithAlert}
                />
                <AlertsAside
                    className={styles.alertsAside}
                    countriesWithAlert={countriesWithAlert}
                />
            </AlertContext.Provider>
        </Container>
    );
}

export default AlertsView;
