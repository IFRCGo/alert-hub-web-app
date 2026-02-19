import {
    ListView,
    TabPanel,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import { AlertInfoQuery } from '#generated/types/graphql';
import { DATE_FORMAT } from '#utils/constants';

import i18n from './i18n.json';

type InfoAlertType = NonNullable<NonNullable<AlertInfoQuery['public']>['alert']>;
type InfosDetail = InfoAlertType['infos'][number];

interface Props {
    data: InfosDetail;
}

function AlertInfo(props: Props) {
    const {
        data,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <TabPanel
            name={data.id}
        >
            <ListView
                layout="block"
                spacing="2xs"
            >
                <TextOutput
                    label={strings.alertInfoLanguage}
                    value={data?.language}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertInfoCategory}
                    value={data?.categoryDisplay}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertInfoEvent}
                    value={data?.event}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertInfoResponseType}
                    value={data?.responseTypeDisplay}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertInfoUrgency}
                    value={data?.urgencyDisplay}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertInfoCertainty}
                    value={data?.certaintyDisplay}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertAudience}
                    value={data?.audience}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertEventCode}
                    value={data?.eventCode}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertEffective}
                    value={data?.effective}
                    valueType="date"
                    format={DATE_FORMAT}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertOnset}
                    value={data?.onset}
                    format={DATE_FORMAT}
                    valueType="date"
                    strongLabel
                />
                <TextOutput
                    label={strings.alertExpiration}
                    value={data?.expires}
                    format={DATE_FORMAT}
                    valueType="date"
                    strongLabel
                />
                <TextOutput
                    label={strings.alertSenderName}
                    value={data?.senderName}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertHeadline}
                    value={data?.headline}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertInstruction}
                    value={data?.instruction}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertDescription}
                    value={data?.description}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertWeb}
                    value={data?.web}
                    strongLabel
                />
                <TextOutput
                    label={strings.alertContactInformation}
                    value={data?.contact}
                    strongLabel
                />
            </ListView>

        </TabPanel>
    );
}

export default AlertInfo;
