import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { useSizeTracking } from '@ifrc-go/ui/hooks';
import { viewport as geoViewport } from '@placemarkio/geo-viewport';
import {
    _cs,
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';
import {
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
    FilteredCountryListQuery,
} from '#generated/types/graphql';
import {
    COLOR_DARK_GREY,
    COLOR_LIGHT_GREY,
    COLOR_PRIMARY_RED,
} from '#utils/constants';
import useAlertFilters from '#views/Home/useAlertFilters';

import AlertDataContext from '../../AlertDataContext';

import styles from './styles.module.css';

const defaultBounds: LngLatBoundsLike = [-160, -60, 190, 80];

interface MapMinZoomProps {
    zoom: number;
    bounds: [number, number, number, number],
    mapSize: {
        width: number;
        height: number;
    }
}

function MapMinZoom(props: MapMinZoomProps) {
    const { map } = useContext(MapChildContext);
    const {
        zoom,
        bounds,
        mapSize,
    } = props;

    // Handle change in bounds
    useEffect(
        () => {
            if (!map) {
                return;
            }

            const viewport = geoViewport(
                bounds,
                [mapSize.width, mapSize.height],
                { allowFloat: true },
            );

            // NOTE: 0.98 is for padding, doing -1 exactly matches bound, dont know why
            const mapZoom = (viewport.zoom - 1) * 0.98;

            map.flyTo({
                center: viewport.center,
                zoom: Math.max(zoom, mapZoom),
            });
        },
        [map, zoom, bounds, mapSize],
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
        id
        admin1s(alertFilters: $alertFilters) {
          id
          ifrcGoId
        }
      }
    }
  }
`;

type CountryType = NonNullable<NonNullable<FilteredCountryListQuery['public']>['allCountries']>[number];

interface Props {
    className: string;
    countriesWithAlert?: CountryType[];
}

function Map(props: Props) {
    const {
        countriesWithAlert,
        className,
    } = props;

    const alertFilters = useAlertFilters();

    const {
        activeCountryDetails,
        activeAdmin1Details,
        activeCountryId,
        activeAdmin1Id,
        setActiveCountryId,
        setActiveAdmin1Id,
    } = useContext(AlertDataContext);

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

    const bounds = useMemo(
        () => {
            if (isDefined(activeAdmin1Id) && isDefined(activeAdmin1Details?.public.admin1?.bbox)) {
                return getBbox(activeAdmin1Details?.public.admin1?.bbox);
            }

            if (
                isDefined(activeCountryId)
                && isDefined(activeCountryDetails?.public.country?.bbox)
            ) {
                return getBbox(activeCountryDetails?.public.country?.bbox);
            }

            return defaultBounds;
        },
        [activeCountryId, activeAdmin1Id, activeAdmin1Details, activeCountryDetails],
    );

    const activeGoCountryId = activeCountryDetails?.public.country?.ifrcGoId;

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

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapSize = useSizeTracking(mapContainerRef);

    return (
        <div
            ref={mapContainerRef}
            className={_cs(className, styles.map)}
        >
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
                    bounds={bounds}
                    mapSize={mapSize}
                />
                <MapOrder
                    ordering={['admin-0', 'admin-1-highlight']}
                />
            </BaseMap>
        </div>
    );
}

export default Map;
