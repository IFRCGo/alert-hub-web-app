import { useMemo } from 'react';
import {
    _cs,
    isNotDefined,
    unique,
} from '@togglecorp/fujs';
import {
    MapBounds,
    MapContainer,
    MapLayer,
} from '@togglecorp/re-map';
import getBbox from '@turf/bbox';
import type { FillLayer } from 'mapbox-gl';

import BaseMap from '#components/domain/BaseMap';
import { AlertDetailsQuery } from '#generated/types/graphql';
import {
    COLOR_LIGHT_GREY,
    COLOR_PRIMARY_RED,
} from '#utils/constants';

import styles from './styles.module.css';

type AlertInfo = NonNullable<AlertDetailsQuery['public']>['alert'];

export const DURATION_MAP_ZOOM = 1000;
export const DEFAULT_MAP_PADDING = 50;

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
        if (isNotDefined(data) || isNotDefined(data.country)) {
            return {
                type: 'fill',
                paint: {
                    'fill-color': COLOR_LIGHT_GREY,
                },
                layout: {
                    visibility: 'visible',
                },
            };
        }

        const uniqueAdmin1s = unique(
            [data.country],
            (item) => item.id,
        );
        // TODO: only for test purpose, yet not properly implemented in server
        return {
            type: 'fill',
            paint: {
                'fill-opacity': 1,
                'fill-color': [
                    'match',
                    ['get', 'iso3'],
                    ...uniqueAdmin1s.flatMap(
                        (admin) => [
                            admin.iso3,
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

    const bounds = useMemo(() => (
        data?.country ? getBbox(data?.country.bbox) : undefined
    ), [data?.country]);

    return (
        <div className={_cs(className, styles.alertMap)}>
            <BaseMap
                baseLayers={(
                    <MapLayer
                        layerKey="admin-0"
                        layerOptions={admin1FillOptions}
                        hoverable
                    />
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
