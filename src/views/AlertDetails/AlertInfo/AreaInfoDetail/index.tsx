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

import { GetAreaAlertInfoQuery } from '#generated/types/graphql';
import {
    stringIdSelector,
    stringNameSelector,
} from '#utils/selectors';

import i18n from './i18n.json';
import styles from './styles.module.css';

type AreaInfo = NonNullable<NonNullable<GetAreaAlertInfoQuery['public']>['alertInfo']>['areas'][number];

type GeocodeInfo = NonNullable<AreaInfo['geocodes'][number]>;

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
                <div className={styles.map} />
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
