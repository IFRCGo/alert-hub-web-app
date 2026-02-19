import { useMemo } from 'react';
import {
    _cs,
    isNotDefined,
} from '@togglecorp/fujs';
import {
    MapBounds,
    MapContainer,
    MapLayer,
} from '@togglecorp/re-map';
import getBbox from '@turf/bbox';
import type {
    FillLayer,
    LngLatBoundsLike,
} from 'mapbox-gl';

import BaseMap from '#components/domain/BaseMap';
import { AlertDetailsQuery } from '#generated/types/graphql';
import {
    COLOR_LIGHT_GREY,
    COLOR_PRIMARY_RED,
} from '#utils/constants';

import styles from './styles.module.css';

type AlertInfo = NonNullable<AlertDetailsQuery['public']>['alert'];

const DURATION_MAP_ZOOM = 1000;
const DEFAULT_MAP_PADDING = 50;

interface Props {
    className?: string;
    data?: AlertInfo;
}

function CountryAlertMap(props: Props) {
    const {
        className,
        data,
    } = props;

    // TODO: Implement once server is ready for map compatible data
    const admin1FillOptions = useMemo<Omit<FillLayer, 'id'>>(() => {
        if (isNotDefined(data) || isNotDefined(data.admin1s) || data.admin1s.length === 0) {
            return {
                type: 'fill',
                layout: {
                    visibility: 'visible',
                },
            };
        }

        return {
            type: 'fill',
            paint: {
                'fill-opacity': 1,
                'fill-color': [
                    'match',
                    ['get', 'district_id'],
                    ...data.admin1s.flatMap(
                        (admin) => [
                            Number(admin.ifrcGoId),
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
    }, [data]);

    const bounds = useMemo(() => {
        if (isNotDefined(data?.country?.bbox)) {
            return undefined;
        }
        return getBbox(data.country.bbox) as LngLatBoundsLike;
    }, [data?.country?.bbox]);

    return (
        <div className={_cs(className, styles.alertMap)}>
            <BaseMap
                baseLayers={(
                    <>
                        <MapLayer
                            layerKey="admin-1-highlight"
                            layerOptions={admin1FillOptions}
                            hoverable
                        />
                        {/* <MapLayer
                            layerKey="admin-1-label"
                            layerOptions={{
                                type: 'symbol',
                                layout: {
                                    visibility: 'visible',
                                },
                                paint: {
                                    'text-opacity': 1,
                                    'text-color': '#000000',
                                    'text-halo-color': '#000000',
                                    'text-halo-width': 0.2,
                                },
                            }}
                        /> */}
                    </>
                )}
            >
                <MapContainer
                    className={styles.mapContainer}
                />
                <MapBounds
                    bounds={bounds}
                    padding={DEFAULT_MAP_PADDING}
                    duration={DURATION_MAP_ZOOM}
                />
            </BaseMap>
        </div>
    );
}

export default CountryAlertMap;
