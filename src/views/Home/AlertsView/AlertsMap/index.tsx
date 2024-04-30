import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    _cs,
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';
import {
    MapBounds,
    MapChildContext,
    MapContainer,
    MapLayer,
    MapOrder,
} from '@togglecorp/re-map';
import getBbox from '@turf/bbox';
import {
    type FillLayer,
    LngLatBoundsLike,
    MapboxGeoJSONFeature,
} from 'mapbox-gl';

import BaseMap from '#components/domain/BaseMap';
import {
    Admin1WithAlertsQuery,
    Admin1WithAlertsQueryVariables,
    CountryListQuery,
} from '#generated/types/graphql';
import {
    COLOR_DARK_GREY,
    COLOR_LIGHT_GREY,
    COLOR_PRIMARY_RED,
} from '#utils/constants';
import useAlertFilters from '#views/Home/useAlertFilters';

import AlertContext from '../../AlertContext';

import styles from './styles.module.css';

interface MapMinZoomProps {
    zoom: number;
}

function MapMinZoom(props: MapMinZoomProps) {
    const { map } = useContext(MapChildContext);
    const { zoom } = props;

    // Handle change in bounds
    useEffect(
        () => {
            if (!map) {
                return;
            }

            map.setZoom(zoom);
            map.setMinZoom(zoom);
        },
        [map, zoom],
    );

    return null;
}

const ADMIN1_WITH_ALERTS = gql`
query Admin1WithAlerts(
    $alertFilters: AlertFilter = {},
    $country: ID!
) {
    public {
      id
      country(pk: $country) {
        admin1s(alertFilters: $alertFilters) {
          id
          ifrcGoId
        }
      }
    }
  }
`;

type CountryType = NonNullable<NonNullable<CountryListQuery['public']>['allCountries']>[number];

const DURATION_MAP_ZOOM = 1000;
const DEFAULT_MAP_PADDING = 50;
const defaultBounds: LngLatBoundsLike = [-160, -60, 190, 80];

interface Props {
    className: string;
    countriesWithAlert?: CountryType[];
}

function AlertsMap(props: Props) {
    const {
        countriesWithAlert,
        className,
    } = props;

    const alertFilters = useAlertFilters();

    const {
        bbox,
        activeCountryId,
        activeAdmin1Id,
        activeGoCountryId,
        setActiveCountryId,
        setActiveAdmin1Id,
    } = useContext(AlertContext);

    const variables = useMemo<Admin1WithAlertsQueryVariables | undefined>(
        () => (
            isDefined(activeCountryId)
                ? {
                    country: activeCountryId,
                    alertFilters,
                }
                : undefined
        ),
        [
            alertFilters,
            activeCountryId,
        ],
    );

    const {
        data: admin1Response,
    } = useQuery<Admin1WithAlertsQuery, Admin1WithAlertsQueryVariables>(
        ADMIN1_WITH_ALERTS,
        {
            skip: isNotDefined(activeCountryId),
            variables,
        },
    );

    const countryBounds = useMemo(
        () => (
            isDefined(bbox)
                ? getBbox(bbox)
                : defaultBounds
        ),
        [bbox],
    );

    const admin0FillOptions = useMemo<Omit<FillLayer, 'id'>>(() => {
        if (activeGoCountryId) {
            return {
                type: 'fill',
                layout: {
                    visibility: 'visible',
                },
                paint: {
                    'fill-opacity': 1,
                    'fill-color': [
                        'match',
                        ['get', 'country_id'],
                        Number(activeGoCountryId),
                        COLOR_DARK_GREY,
                        COLOR_LIGHT_GREY,
                    ],
                },
            };
        }

        return {
            type: 'fill',
            layout: {
                visibility: 'visible',
            },
            paint: {
                'fill-opacity': 1,
                'fill-color': countriesWithAlert && countriesWithAlert.length > 0 ? [
                    'match',
                    ['get', 'iso3'],
                    ...countriesWithAlert.flatMap((country) => [
                        country.iso3.toUpperCase(),
                        COLOR_PRIMARY_RED,
                    ]),
                    COLOR_LIGHT_GREY,
                ] : COLOR_LIGHT_GREY,
            },
        };
    }, [countriesWithAlert, activeGoCountryId]);

    let admin1sWithAlert = useMemo(
        () => (
            admin1Response?.public?.country?.admin1s?.map(
                (item) => {
                    if (isNotDefined(item.ifrcGoId)) {
                        return undefined;
                    }
                    return {
                        ...item,
                        ifrcGoId: item.ifrcGoId,
                    };
                },
            ).filter(isDefined)
        ),
        [admin1Response?.public.country?.admin1s],
    );

    if (isDefined(activeAdmin1Id)) {
        admin1sWithAlert = admin1sWithAlert?.filter((admin1) => admin1.id === activeAdmin1Id);
    }

    const admin1FillOptions = useMemo<Omit<FillLayer, 'id'>>(() => {
        if (!activeGoCountryId) {
            return {
                type: 'fill',
                layout: {
                    visibility: 'none',
                },
            };
        }

        return {
            type: 'fill',
            layout: {
                visibility: 'visible',
            },
            paint: {
                'fill-opacity': 1,
                'fill-color': admin1sWithAlert && admin1sWithAlert.length > 0 ? [
                    'match',
                    ['get', 'district_id'],
                    ...admin1sWithAlert.flatMap((admin) => [
                        Number(admin.ifrcGoId),
                        COLOR_PRIMARY_RED,
                    ]),
                    'transparent',
                ] : 'transparent',
            },
        };
    }, [activeGoCountryId, admin1sWithAlert]);

    const handlePointClick = useCallback(
        (e: MapboxGeoJSONFeature) => {
            const pointProperties = e.properties;
            if (!pointProperties) {
                return undefined;
            }
            const activeCountry = countriesWithAlert?.find(
                (country) => String(country.ifrcGoId) === String(pointProperties.country_id),
            );
            setActiveCountryId(activeCountry?.id);
            return undefined;
        },
        [
            setActiveCountryId,
            countriesWithAlert,
        ],
    );

    const handleAdmin1PointClick = useCallback(
        (e: MapboxGeoJSONFeature) => {
            const pointProperties = e.properties;
            if (!pointProperties) {
                return undefined;
            }
            const activeAdmin1 = admin1Response?.public?.country?.admin1s?.find(
                (admin) => String(admin.ifrcGoId) === String(pointProperties.district_id),
            );
            setActiveAdmin1Id(activeAdmin1?.id);
            return undefined;
        },
        [
            setActiveAdmin1Id,
            admin1Response,
        ],
    );

    return (
        <div className={_cs(className, styles.alertsMap)}>
            <BaseMap
                baseLayers={(
                    <>
                        <MapLayer
                            layerKey="admin-0"
                            layerOptions={admin0FillOptions}
                            // NOTE: We need to disable click on country if a
                            // country is already selected
                            onClick={activeGoCountryId ? undefined : handlePointClick}
                            hoverable
                        />
                        <MapLayer
                            layerKey="admin-1-highlight"
                            layerOptions={admin1FillOptions}
                            onClick={handleAdmin1PointClick}
                            hoverable
                        />
                    </>
                )}
            >
                <MapContainer
                    className={styles.mapContainer}
                />
                <MapMinZoom
                    zoom={isDefined(activeGoCountryId) ? 3 : 1}
                />
                {countryBounds && (
                    <MapBounds
                        bounds={countryBounds}
                        padding={DEFAULT_MAP_PADDING}
                        duration={DURATION_MAP_ZOOM}
                    />
                )}
                <MapOrder
                    ordering={['admin-0', 'admin-1-highlight']}
                />
            </BaseMap>
        </div>
    );
}

export default AlertsMap;
