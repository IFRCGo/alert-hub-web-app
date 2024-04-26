import {
    useMemo,
    useState,
} from 'react';
import {
    Container,
    SelectInput,
    Table,
    TabPanel,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    createStringColumn,
    resolveToString,
} from '@ifrc-go/ui/utils';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';
import {
    MapBounds,
    MapContainer,
    MapLayer,
    MapSource,
} from '@togglecorp/re-map';
import getBbox from '@turf/bbox';
import generateCircle from '@turf/circle';
import {
    CircleLayer,
    FillLayer,
    LineLayer,
    LngLatBoundsLike,
} from 'mapbox-gl';

import BaseMap from '#components/domain/BaseMap';
import { GetAreaAlertInfoQuery } from '#generated/types/graphql';
import { COLOR_PRIMARY_RED } from '#utils/constants';
import {
    stringIdSelector,
    stringKeySelector,
    stringNameSelector,
} from '#utils/selectors';

import i18n from './i18n.json';
import styles from './styles.module.css';

type AreaInfo = NonNullable<NonNullable<GetAreaAlertInfoQuery['public']>['alertInfo']>['areas'][number];

type GeocodeInfo = NonNullable<AreaInfo['geocodes'][number]>;

const DURATION_MAP_ZOOM = 1000;
const DEFAULT_MAP_PADDING = 50;
const defaultBounds: LngLatBoundsLike = [-160, -60, 190, 80];
const polygonFillOption: Omit<FillLayer, 'id'> = {
    type: 'fill',
    paint: {
        'fill-color': COLOR_PRIMARY_RED,
        'fill-opacity': 0.4,
    },
    layout: {
        visibility: 'visible',
    },
};
const circleLayerOption: Omit<CircleLayer, 'id'> = {
    type: 'circle',
    paint: {
        'circle-color': COLOR_PRIMARY_RED,
        'circle-radius': 6,
    },
    layout: {
        visibility: 'visible',
    },
};
const polygonOutlineOption: Omit<LineLayer, 'id'> = {
    type: 'line',
    paint: {
        'line-color': COLOR_PRIMARY_RED,
        'line-width': 2,
        'line-opacity': 1,
    },
    layout: {
        visibility: 'visible',
    },
};

interface Props {
    data: AreaInfo;
}

function AreaInfoDetail(props: Props) {
    const { data } = props;

    const strings = useTranslation(i18n);
    const [selectedFeature, setSelectedFeature] = useState<string | undefined>();

    const columns = useMemo(() => ([
        createStringColumn<GeocodeInfo, string>(
            'id',
            strings.areaAlertInfoGeocode,
            (item) => item.id,
        ),
        createStringColumn<GeocodeInfo, string>(
            'name',
            strings.areaAlertInfoValueName,
            (item) => item.valueName,
        ),
        createStringColumn<GeocodeInfo, string>(
            'value',
            strings.areaAlertInfoValue,
            (item) => item.value,
        ),
    ]), [
        strings.areaAlertInfoGeocode,
        strings.areaAlertInfoValueName,
        strings.areaAlertInfoValue,
    ]);

    const featureOptions = useMemo(
        () => {
            const polygonOptions = data?.polygons.map((polygon, index) => ({
                ...polygon,
                type: 'polygon' as const,
                key: `polygon:${polygon.id}`,
                name: resolveToString(strings.polygonOptionLabel, { polygonNum: index + 1 }),
            }));

            const circleOptions = data?.circles.map((circle, index) => ({
                ...circle,
                type: 'circle' as const,
                key: `circle:${circle.id}`,
                name: resolveToString(strings.circleOptionLabel, { circleNum: index + 1 }),
            }));

            return [
                ...polygonOptions,
                ...circleOptions,
            ];
        },
        [data, strings],
    );

    const selectedFeatureDetails = useMemo(
        () => featureOptions.find((feature) => feature.key === selectedFeature),
        [featureOptions, selectedFeature],
    );

    const selectedPolygon = useMemo(
        () => {
            if (isNotDefined(selectedFeatureDetails)) {
                return undefined;
            }

            if (selectedFeatureDetails.type !== 'polygon') {
                return undefined;
            }

            return {
                key: selectedFeatureDetails.key,
                boundary: selectedFeatureDetails.valuePolygon,
            };
        },
        [selectedFeatureDetails],
    );

    const selectedCircle = useMemo(
        () => {
            if (isNotDefined(selectedFeatureDetails)) {
                return undefined;
            }

            if (selectedFeatureDetails.type !== 'circle') {
                return undefined;
            }

            const [centerStr, radiusStr] = selectedFeatureDetails.value.split(' ');
            const [latStr, lonStr] = centerStr.split(',');
            const options = {
                steps: 50,
                units: 'kilometers',
            };

            const point = [+latStr, +lonStr];

            const boundary = generateCircle(
                point,
                +radiusStr,
                options,
            );

            return {
                key: selectedFeatureDetails.key,
                point: {
                    type: 'Feature' as const,
                    geometry: {
                        type: 'Point' as const,
                        coordinates: point,
                    },
                    properties: {},
                },
                boundary,
            };
        },
        [selectedFeatureDetails],
    );

    const selectedPolygonBounds = useMemo(() => {
        if (isDefined(selectedPolygon)) {
            return getBbox(selectedPolygon.boundary);
        }

        if (isDefined(selectedCircle)) {
            return getBbox(selectedCircle.boundary);
        }

        return defaultBounds;
    }, [selectedPolygon, selectedCircle]);

    return (
        <TabPanel
            name={data.id}
            className={styles.areaInfoDetail}
        >
            <Container
                className={styles.areaDetails}
                heading={data?.areaDesc}
                contentViewType="vertical"
                filters={(
                    <SelectInput
                        label={strings.areaAlertPolygon}
                        name="feature"
                        placeholder={strings.areaAlertChooseAnOption}
                        options={featureOptions}
                        keySelector={stringKeySelector}
                        labelSelector={stringNameSelector}
                        value={selectedFeature}
                        onChange={setSelectedFeature}
                    />
                )}
                withGridViewInFilter
                headingLevel={4}
            >
                <div className={styles.map}>
                    <BaseMap>
                        <MapContainer
                            className={styles.mapContainer}
                        />
                        {isDefined(selectedPolygon) && (
                            <MapSource
                                sourceKey={selectedPolygon.key}
                                geoJson={selectedPolygon.boundary}
                                sourceOptions={{ type: 'geojson' }}
                            >
                                <MapLayer
                                    layerKey="polygon-fill"
                                    layerOptions={polygonFillOption}
                                />
                                <MapLayer
                                    layerKey="polygon-outline"
                                    layerOptions={polygonOutlineOption}
                                />
                            </MapSource>
                        )}
                        {isDefined(selectedCircle) && (
                            <>
                                <MapSource
                                    sourceKey={`${selectedCircle.key}-boundary`}
                                    geoJson={selectedCircle.boundary}
                                    sourceOptions={{ type: 'geojson' }}
                                >
                                    <MapLayer
                                        layerKey="polygon-fill"
                                        layerOptions={polygonFillOption}
                                    />
                                    <MapLayer
                                        layerKey="polygon-outline"
                                        layerOptions={polygonOutlineOption}
                                    />
                                </MapSource>
                                <MapSource
                                    sourceKey={`${selectedCircle.key}-point`}
                                    geoJson={selectedCircle.point}
                                    sourceOptions={{ type: 'geojson' }}
                                >
                                    <MapLayer
                                        layerKey="circle"
                                        layerOptions={circleLayerOption}
                                    />
                                </MapSource>
                            </>
                        )}
                        <MapBounds
                            bounds={selectedPolygonBounds}
                            padding={DEFAULT_MAP_PADDING}
                            duration={DURATION_MAP_ZOOM}
                        />
                    </BaseMap>
                </div>
            </Container>
            <Container
                className={styles.geocodes}
                heading={strings.areaAlertGeocodes}
            >
                <Table
                    columns={columns}
                    keySelector={stringIdSelector}
                    data={data?.geocodes}
                    filtered={false}
                    pending={false}
                />
            </Container>
        </TabPanel>
    );
}

export default AreaInfoDetail;
