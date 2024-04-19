import {
    useContext,
    useMemo,
} from 'react';
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
import getBbox from '@turf/bbox';
import {
    type FillLayer,
    LngLatBoundsLike,
} from 'mapbox-gl';

import BaseMap from '#components/domain/BaseMap';
import { CountryListQuery } from '#generated/types/graphql';
import {
    COLOR_LIGHT_GREY,
    COLOR_PRIMARY_RED,
} from '#utils/constants';

import AlertContext from '../AlertContext';

import styles from './styles.module.css';

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

    const {
        bbox,
        activeGoCountryId,
    } = useContext(AlertContext);

    const bounds = isDefined(bbox) ? getBbox(bbox) : defaultBounds;

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
                            isDefined(activeGoCountryId) && country.ifrcGoId !== activeGoCountryId
                                ? COLOR_LIGHT_GREY
                                : [
                                    'interpolate',
                                    ['linear'],
                                    ['number', Math.log(country.filteredAlertCount ?? 0)],
                                    0,
                                    COLOR_LIGHT_GREY,
                                    10,
                                    COLOR_PRIMARY_RED,
                                ],
                        ],
                    ),
                    COLOR_LIGHT_GREY,
                ],
            },
            layout: {
                visibility: 'visible',
            },
        };
    }, [countriesWithAlert, activeGoCountryId]);

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
                {bounds && (
                    <MapBounds
                        bounds={bounds}
                        padding={DEFAULT_MAP_PADDING}
                        duration={DURATION_MAP_ZOOM}
                    />
                )}
            </BaseMap>
        </div>
    );
}

export default AlertsMap;
