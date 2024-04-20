import { useCallback, useMemo } from 'react';
import {
    Header,
    SelectInput,
    Table,
    TabPanel,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { createStringColumn } from '@ifrc-go/ui/utils';

import { GetAreaAlertInfoQuery } from '#generated/types/graphql';
import { stringIdSelector } from '#utils/selectors';
import { EntriesAsList } from '../../../../types';

import i18n from './i18n.json';

type AreaInfo = NonNullable<NonNullable<GetAreaAlertInfoQuery['public']>['alertInfo']>['areas'][number];

type PolygonInfo = NonNullable<AreaInfo['polygons'][number]>;
type GeocodeInfo = NonNullable<AreaInfo['geocodes'][number]>;

export interface FilterValue {
    polygon: string | undefined;
}

interface Props {
    data: AreaInfo;
    onChange?: React.Dispatch<React.SetStateAction<FilterValue>>;
    value?: FilterValue;
}

const keySelector = (polygon: PolygonInfo) => polygon.id;
const labelSelector = (polygon: PolygonInfo) => polygon.value;

function AreaInfoDetail(props: Props) {
    const {
        data,
        onChange,
        value,
    } = props;

    const strings = useTranslation(i18n);

    const columns = useMemo(() => ([
        createStringColumn<GeocodeInfo, string>(
            'value',
            strings.areaAlertInfoGeoCode,
            (item) => item.alertInfoAreaId,
        ),
        createStringColumn<GeocodeInfo, string>(
            'value',
            strings.areaAlertInfoValueName,
            (item) => item.valueName,
        ),
        createStringColumn<GeocodeInfo, string>(
            'value',
            strings.areaAlertInfoValue,
            (item) => item.value,
        ),
    ]), [
        strings.areaAlertInfoGeoCode,
        strings.areaAlertInfoValueName,
        strings.areaAlertInfoValue,
    ]);

    const handleChange = useCallback(
        (...args: EntriesAsList<FilterValue>) => {
            const [val, key] = args;
            onChange((prevValue): FilterValue => ({
                ...prevValue,
                [key]: val,
            }));
        },
        [onChange],
    );

    return (
        <TabPanel name={data.id}>
            <TextOutput
                label={strings.areaAlertAreaDescription}
                value={data?.areaDesc}
            />
            <Header
                heading={strings.areaAlertPolygon}
            />
            <SelectInput
                name="polygon"
                placeholder={strings.areaAlertChooseAnOption}
                options={data?.polygons}
                keySelector={keySelector}
                labelSelector={labelSelector}
                value={value?.polygon}
                onChange={handleChange}
            />
            <Header
                heading={strings.areaAlertGeocodes}
            />
            <Table
                columns={columns}
                keySelector={stringIdSelector}
                data={data?.geocodes}
                filtered={false}
                pending={false}
            />
        </TabPanel>
    );
}

export default AreaInfoDetail;
