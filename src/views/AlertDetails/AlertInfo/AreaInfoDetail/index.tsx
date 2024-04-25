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
import { isNotDefined } from '@togglecorp/fujs';
import {
    MapBounds,
    MapContainer,
    MapLayer,
} from '@togglecorp/re-map';
import getBbox from '@turf/bbox';
import {
    FillLayer,
    LngLatBoundsLike,
} from 'mapbox-gl';

import BaseMap from '#components/domain/BaseMap';
import { GetAreaAlertInfoQuery } from '#generated/types/graphql';
import {
    COLOR_LIGHT_GREY,
    COLOR_PRIMARY_RED,
} from '#utils/constants';
import {
    stringIdSelector,
    stringNameSelector,
} from '#utils/selectors';

import i18n from './i18n.json';
import styles from './styles.module.css';

type AreaInfo = NonNullable<NonNullable<GetAreaAlertInfoQuery['public']>['alertInfo']>['areas'][number];

type GeocodeInfo = NonNullable<AreaInfo['geocodes'][number]>;

const DURATION_MAP_ZOOM = 1000;
const DEFAULT_MAP_PADDING = 50;
const defaultBounds: LngLatBoundsLike = [-160, -60, 190, 80];

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
                name: resolveToString(strings.polygonOptionLabel, { polygonNum: index + 1 }),
            }));

            const circleOptions = data?.circles.map((circle, index) => ({
                ...circle,
                name: resolveToString(strings.circleOptionLabel, { circleNum: index + 1 }),
            }));

            return [
                ...polygonOptions,
                ...circleOptions,
            ];
        },
        [data, strings],
    );

    const polygonFillOptions = useMemo<Omit<FillLayer, 'id'>>(() => {
        if (isNotDefined(data) || isNotDefined(selectedFeature)) {
            return {
                type: 'fill',
                paint: {
                    'fill-color': COLOR_PRIMARY_RED,
                },
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
                    ['get', 'id'],
                    selectedFeature,
                    COLOR_PRIMARY_RED,
                    COLOR_LIGHT_GREY,
                ],
            },
            layout: {
                visibility: 'visible',
            },
        };
    }, [
        data,
        selectedFeature,
    ]);

    const polygonBox = useMemo(() => {
        const selectedPolygon = data?.polygons.find((value) => value.id === selectedFeature);
        if (isNotDefined(selectedPolygon) || isNotDefined(selectedPolygon.valuePolygon)) {
            return defaultBounds;
        }
        const bBox = getBbox(selectedPolygon.valuePolygon);
        return bBox;
    }, [
        data,
        selectedFeature,
    ]);

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
                        keySelector={stringIdSelector}
                        labelSelector={stringNameSelector}
                        value={selectedFeature}
                        onChange={setSelectedFeature}
                    />
                )}
                withGridViewInFilter
                headingLevel={4}
            >
                <div className={styles.map}>
                    <BaseMap
                        baseLayers={(
                            <MapLayer
                                layerKey="admin-1"
                                layerOptions={polygonFillOptions}
                                hoverable
                            />
                        )}
                    >
                        <MapContainer
                            className={styles.mapContainer}
                        />
                        <MapBounds
                            bounds={polygonBox}
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
