import { useMemo } from 'react';
import {
    _cs,
    isNotDefined,
    unique,
} from '@togglecorp/fujs';
import {
    MapContainer,
    MapLayer,
} from '@togglecorp/re-map';
import type { FillLayer } from 'mapbox-gl';

import BaseMap from '#components/domain/BaseMap';
import { AlertDetailsQuery } from '#generated/types/graphql';
import {
    COLOR_LIGHT_GREY,
    COLOR_PRIMARY_RED,
} from '#utils/constants';

import styles from './styles.module.css';

type AlertInfo = NonNullable<AlertDetailsQuery['public']>['alert'];

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
    const countryFillOptions = useMemo<Omit<FillLayer, 'id'>>(() => {
        if (isNotDefined(data) || isNotDefined(data.country)) {
            return {
                type: 'fill',
                layout: {
                    visibility: 'visible',
                },
            };
        }

        const uniqueAdmin1s = unique(
            data.country.admin1s,
            (item) => item.id,
        );

        return {
            type: 'fill',
            paint: {
                'fill-opacity': 1,
                'fill-color': [
                    'match',
                    ['get', 'iso3'],
                    ...uniqueAdmin1s.flatMap(
                        (admin) => [
                            admin.id,
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

    return (
        <div className={_cs(className, styles.alertMap)}>
            <BaseMap
                baseLayers={(
                    <MapLayer
                        layerKey="admin-0"
                        layerOptions={countryFillOptions}
                        hoverable
                    />
                )}
            >
                <MapContainer
                    className={styles.mapContainer}
                />
            </BaseMap>
        </div>
    );
}

export default CountryAlertMap;
