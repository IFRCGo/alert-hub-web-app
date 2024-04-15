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
import { CountryListQuery } from '#generated/types/graphql';
import {
    COLOR_LIGHT_GREY,
    COLOR_PRIMARY_RED,
} from '#utils/constants';

import styles from './styles.module.css';

type CountryType = NonNullable<NonNullable<CountryListQuery['public']>['allCountries']>[number];

interface Props {
    className?: string;
    countriesWithAlert?: CountryType[];
}

function AlertsMap(props: Props) {
    const { countriesWithAlert, className } = props;

    const countryFillOptions = useMemo<Omit<FillLayer, 'id'>>(() => {
        if (isNotDefined(countriesWithAlert)) {
            return {
                type: 'fill',
                layout: {
                    visibility: 'visible',
                },
            };
        }

        const uniqueCountries = unique(
            countriesWithAlert,
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
    }, [countriesWithAlert]);

    return (
        <div className={_cs(className, styles.alertsMap)}>
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

export default AlertsMap;
