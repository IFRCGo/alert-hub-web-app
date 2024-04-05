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
import { ChevronLeftLineIcon } from '@ifrc-go/icons';
import {
    BlockLoading,
    Button,
    Container,
    List,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    _cs,
    isDefined,
    isNotDefined,
    unique,
} from '@togglecorp/fujs';
import {
    MapBounds,
    MapContainer,
    MapLayer,
} from '@togglecorp/re-map';
import type {
    FillLayer,
    LngLatBoundsLike,
} from 'mapbox-gl';

import BaseMap from '#components/domain/BaseMap';
import MapPopup from '#components/MapPopup';
import useDebouncedValue from '#hooks/useDebouncedValue';
import useInputState from '#hooks/useInputState';

import {
    AlertsInfoQuery,
    AlertsInfoQueryVariables,
    CountryListQuery,
    CountryListQueryVariables,
} from '#generated/types';
import {
    COLOR_LIGHT_GREY,
    COLOR_PRIMARY_RED,
    DEFAULT_MAP_PADDING,
    DURATION_MAP_ZOOM,
} from '#utils/constants';

import CountryListItem from './CountryListItem';
import i18n from './i18n.json';
import styles from './styles.module.css';
import Filters, { FilterValue } from './Filters';

const ALERTS_INFO = gql`
query AlertsInfo {
    public {
        alerts {
            items {
              id
              addresses
              country {
                centroid
                continent {
                  id
                }
                admin1s {
                  countryId
                  id
                  isUnknown
                  maxLatitude
                  maxLongitude
                  minLatitude
                  minLongitude
                  multipolygon
                  name
                  country {
                    id
                    iso3
                    name
                    admin1s {
                      country {
                        id
                        name
                        iso3
                      }
                      countryId
                      id
                    }
                  }
                }
                iso3
                id
                name
                region {
                  id
                  name
                  centroid
                }
                regionId
              }
              infos {
                alertId
                audience
                category
                categoryDisplay
                certainty
                certaintyDisplay
                contact
                effective
                event
                eventCode
                expires
                headline
                id
                instruction
                language
                onset
                parameter
                parameters {
                  id
                }
              }
              countryId
            }
            limit
            offset
        }
    }
  }
`;

const COUNTRIES_LIST = gql`
query CountryList {
    public {
        countries {
          items {
            name
            id
            admin1s {
              name
              id
              country {
                iso3
                name
              }
            }
            iso3
          }
        }
    }
}`;

const defaultFilterValue: FilterValue = {
    countries: [],
    regions: [],
};

type AlertType = NonNullable<NonNullable<NonNullable<AlertsInfoQuery['public']>['alerts']>['items']>[number];

type CountryType = NonNullable<NonNullable<NonNullable<CountryListQuery['public']>['countries']>['items']>[number];

type Footprint = GeoJSON.FeatureCollection<GeoJSON.Geometry> | undefined;

type EventPointProperties = {
    id: string | number,
    alert_type: AlertType,
}
export type EventPointFeature = GeoJSON.Feature<GeoJSON.Point, EventPointProperties>;

type Props<EVENT, EXPOSURE> = {
    className?: string;
    bbox: LngLatBoundsLike | undefined;
    onActiveCountryChange: (countryId: | undefined) => void;
    footprintSelector: (activeCountryExposure: EXPOSURE | undefined) => Footprint | undefined;
    pointFeatureSelector: (countryId: EVENT) => EventPointFeature | undefined;
    activeCountryExposurePending: boolean;
    activeCountryExposure: EXPOSURE | undefined;
}

const keySelector = (alert: AlertType) => alert?.id;

const countryKeySelector = (country: CountryType) => country?.id;

interface ClickedPoint {
    feature: GeoJSON.Feature<GeoJSON.Point, AlertsInfoQueryVariables>;
    lngLat: mapboxgl.LngLatLike;
}

function OngoingAlertMap<
    EVENT,
    EXPOSURE,
>(props: Props<EVENT, EXPOSURE>) {
    const {
        className,
        bbox,
        onActiveCountryChange,
    } = props;

    const strings = useTranslation(i18n);
    const [activeCountryId, setActiveCountryId] = useState<string | undefined>(undefined);

    const {
        data: alertsResponse,
        loading: alertLoading,
    } = useQuery<AlertsInfoQuery, AlertsInfoQueryVariables>(
        ALERTS_INFO,
    );

    const {
        data: countryResponse,
        loading: countryLoading,
    } = useQuery<CountryListQuery, CountryListQueryVariables>(
        COUNTRIES_LIST,
    );


    const activeAlerts = useMemo(
        () => {
            if (isNotDefined(activeCountryId)) {
                return undefined;
            }

            return alertsResponse?.public.alerts.items?.filter(
                ({ countryId }) => activeCountryId === countryId,
            );
        },
        [activeCountryId, alertsResponse],
    );

    const bounds = useMemo(
        () => {
            if (isNotDefined(activeCountryId)) {
                return bbox;
            }

            return bbox;
        },
        [
            bbox,
        ],
    );

    const boundsSafe = useDebouncedValue(bounds);

    const [
        clickedPointProperties,
        setClickedPointProperties,
    ] = useState<ClickedPoint | undefined>();

    const handlePointClose = useCallback(
        () => {
            setClickedPointProperties(undefined);
        },
        [setClickedPointProperties],
    );

    const setActiveAlertIdSafe = useCallback(
        (countryId: string | number | undefined) => {
            const countryIdSafe = countryId;

            setActiveCountryId(countryIdSafe);
            onActiveCountryChange(countryIdSafe);
        },
        [onActiveCountryChange],
    );

    const eventListRendererParams = useCallback(
        (_: string | number, alert: AlertType) => ({
            data: alert,
            onExpandClick: setActiveAlertIdSafe,
        }),
        [setActiveAlertIdSafe],
    );

    const countryListRendererParams = useCallback(
        (_: string | number, country: CountryType) => ({
            data: country,
            // onExpandClick: setActiveAlertIdSafe,
        }),
        [],
    );

    const handleCountryClick = useCallback((
        feature: mapboxgl.MapboxGeoJSONFeature,
        lngLat: mapboxgl.LngLatLike,
    ) => {
        setClickedPointProperties({
            feature: feature as unknown as ClickedPoint['feature'],
            lngLat,
        });
        return false;
    }, []);

    const countryFillOptions = useMemo<Omit<FillLayer, 'id'>>(() => {
        if (isNotDefined(countryResponse)) {
            return {
                type: 'fill',
                layout: {
                    visibility: 'visible',
                },
            };
        }
        const uniqueCountries = unique(
            countryResponse.public.countries.items,
            (item) => item.iso3,
        );

        return {
            type: 'fill',
            paint: {
                'fill-opacity': 1,
                'fill-color': [
                    'match',
                    ['get', 'iso3'],
                    ...uniqueCountries.flatMap(
                        (country) => [
                            country.iso3.toUpperCase(),
                            COLOR_PRIMARY_RED,
                        ],
                    ),
                    COLOR_LIGHT_GREY,
                ],
            },
            layout: {
                visibility: 'visible',
            },
        };
    }, [alertsResponse]);

    const [filters, setFilters] = useInputState<FilterValue>(defaultFilterValue);

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
            filters={(
                <Filters
                    countries={countryResponse?.public?.countries.items}
                    value={filters}
                    onChange={setFilters}
                />
            )}
        >
            <BaseMap
                baseLayers={(
                    <MapLayer
                        layerKey="admin-0"
                        layerOptions={countryFillOptions}
                        hoverable
                        onClick={handleCountryClick}
                    />
                )}
            >
                <MapContainer
                    className={styles.mapContainer}
                />
                {clickedPointProperties?.lngLat && (
                    <MapPopup
                        onCloseButtonClick={handlePointClose}
                        coordinates={clickedPointProperties.lngLat}
                        heading="Map"
                        contentViewType="vertical"
                        childrenContainerClassName={styles.popupContent}
                    >
                        Map
                    </MapPopup>
                )}
                {boundsSafe && (
                    <MapBounds
                        duration={DURATION_MAP_ZOOM}
                        bounds={boundsSafe}
                        padding={DEFAULT_MAP_PADDING}
                    />
                )}
            </BaseMap>
            <Container
                className={styles.countryList}
                childrenContainerClassName={styles.content}
                withInternalPadding
                heading={strings.ongoingAlertCountries}
                headingLevel={4}
                withHeaderBorder
                contentViewType="vertical"
                actions={isDefined(activeCountryId) && (
                    <Button
                        name={undefined}
                        onClick={setActiveAlertIdSafe}
                        variant="tertiary"
                        icons={(
                            <ChevronLeftLineIcon className={styles.icon} />
                        )}
                    >
                        {strings.backToAlertsLabel}
                    </Button>
                )}
            >
                {isDefined(countryResponse) && (
                    <List
                        className={styles.countryList}
                        filtered={false}
                        pending={countryLoading}
                        errored={false}
                        data={countryResponse?.public?.countries.items}
                        keySelector={countryKeySelector}
                        renderer={CountryListItem}
                        rendererParams={countryListRendererParams}
                        emptyMessage="No data found"
                    />
                )}
                {alertLoading && <BlockLoading />}
                {/* {isDefined(alertsResponse) && (
                    <List
                        className={styles.countryList}
                        filtered={false}
                        pending={alertLoading}
                        errored={false}
                        data={alertsResponse?.public?.alerts.items}
                        keySelector={keySelector}
                        renderer={AlertListItem}
                        rendererParams={eventListRendererParams}
                        emptyMessage="No data found"
                    />
                )} */}
            </Container>
        </Container>
    );
}

export default OngoingAlertMap;
