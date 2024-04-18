import {
    SelectInput,
    TabPanel,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import { AlertInfoQuery } from '#generated/types/graphql';

import i18n from './i18n.json';

type InfosDetail = NonNullable<NonNullable<NonNullable<AlertInfoQuery['public']>['alert']>['infos']>[number];

interface Props {
    data: InfosDetail;
}

const keySelector = (alert: InfosDetail) => alert.id;
const labelSelector = (alert: InfosDetail) => alert.areas;

function AlertInfo(props: Props) {
    const {
        data,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <TabPanel name={data.id}>
            <SelectInput
                name="polygons"
                label={strings.alertSeeOnTheMap}
                placeholder={strings.alertsChooseAnOption}
                options={data?.areas}
                keySelector={keySelector}
                labelSelector={labelSelector}
                value={data?.areas}
                onChange={() => { }}
            />
            <TextOutput
                label={strings.alertInfoLanguage}
                value={data?.language}
            />
            <TextOutput
                label={strings.alertInfoCategory}
                value={data?.certaintyDisplay}
            />
            <TextOutput
                label={strings.alertInfoEvent}
                value={data?.event}
            />
            <TextOutput
                label={strings.alertInfoResponseType}
                value={data?.responseTypeDisplay}
            />
            <TextOutput
                label={strings.alertInfoUrgency}
                value={data?.urgencyDisplay}
            />
            <TextOutput
                label={strings.alertInfoCertainty}
                value={data?.certaintyDisplay}
            />
        </TabPanel>
    );
}

export default AlertInfo;
