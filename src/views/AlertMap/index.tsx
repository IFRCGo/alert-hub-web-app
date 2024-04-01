import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import { Link } from 'react-router-dom';
import type { LngLatBoundsLike, FillLayer } from 'mapbox-gl';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { Container } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    _cs,
    isNotDefined,
    listToGroupList,
    unique,
} from '@togglecorp/fujs';
import {
    MapBounds,
    MapContainer,
    MapLayer,
} from '@togglecorp/re-map';

import MapPopup from '#components/MapPopup';
import BaseMap from '#components/domain/BaseMap';
import {
    AlertsInfoQuery,
    AlertsInfoQueryVariables,
    CountryInfoQuery,
    CountryInfoQueryVariables,
} from '#generated/types';
import {
    DEFAULT_MAP_PADDING,
    DURATION_MAP_ZOOM,
} from '#utils/constants';

import i18n from './i18n.json';
import styles from './styles.module.css';

const ALERTS_INFO = gql`
query AlertsInfo {
    public {
        alerts {
            items {
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

const COUNTRY_INFO = gql`
query CountryInfo {
    public {
      countries {
        items {
          iso3
          id
          centroid
          continent {
            id
            name
          }
          continentId
          name
          region {
            id
            name
            centroid
          }
          regionId
        }
        limit
        offset
      }
    }
  }
`;

type Props = {
    className?: string;
    alertId: string;
    bbox: LngLatBoundsLike | undefined;
}

const sourceOptions: mapboxgl.GeoJSONSourceRaw = {
    type: 'geojson',
};

interface ClickedPoint {
    feature: GeoJSON.Feature<GeoJSON.Point, AlertsInfoQueryVariables>;
    lngLat: mapboxgl.LngLatLike;
}

function OngoingAlertMap(props: Props) {
    const {
        className,
        bbox,
        alertId,
    } = props;

    const strings = useTranslation(i18n);

    const {
        data: alertsResponse,
    } = useQuery<AlertsInfoQuery, AlertsInfoQueryVariables>(
        ALERTS_INFO,
    );

    const {
        data: countryResponse,
    } = useQuery<CountryInfoQuery, CountryInfoQueryVariables>(
        COUNTRY_INFO,
    );

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
        if (isNotDefined(alertsResponse)) {
            return {
                type: 'fill',
                layout: {
                    visibility: 'visible',
                },
            };
        }
        const uniqueCountries = unique(alertsResponse.public.alerts.items, (item) => item.country.iso3);
        return {
            type: 'fill',
            paint: {
                'fill-opacity': 1,
                'fill-color': [
                    'match',
                    ['get', 'iso3'],
                    ...uniqueCountries.flatMap(
                        (alert) => [
                            alert.country.iso3.toUpperCase(),
                            '#ff0000',
                        ],
                    ),
                    '#e0e0e0',
                ],
            },
            layout: {
                visibility: 'visible',
            },
        };
    }, [alertsResponse?.public.alerts.items]);

    console.info('country', alertsResponse);

    return (
        <Container
            className={_cs(styles.alertMap, className)}
            heading={strings.mapHeading}
            withHeaderBorder
            childrenContainerClassName={styles.content}
            actions={(
                <Link
                    className={styles.sources}
                    to="/"
                >
                    {strings.mapViewAllSources}
                </Link>
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
                        childrenContainerClassName={styles.popupContent}
                        heading="Map"
                    >
                        <>Hello</>
                    </MapPopup>
                )}
                <MapBounds
                    duration={DURATION_MAP_ZOOM}
                    bounds={bbox}
                    padding={DEFAULT_MAP_PADDING}
                />
            </BaseMap>
        </Container>
    );
}

export default OngoingAlertMap;
