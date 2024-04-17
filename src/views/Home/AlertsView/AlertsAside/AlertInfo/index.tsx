import {
    TabPanel,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import { AlertInfosQuery } from '#generated/types/graphql';

import i18n from './i18n.json';

type InfoAlertType = NonNullable<NonNullable<NonNullable<AlertInfosQuery['public']>['alert']>['infos']>[number];

interface Props {
    infoId: string;
    data: InfoAlertType;
}

function AlertInfo(props: Props) {
    const {
        infoId,
        data,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <TabPanel name={infoId}>
            <TextOutput
                label={strings.alertInfoLanguage}
                value={data?.language}
            />
            <TextOutput
                label={strings.alertInfoCategory}
                value={data?.categoryDisplay}
            />
            <TextOutput
                label={strings.alertInfoEvent}
                value={data?.event}
            />
            <TextOutput
                label={strings.alertInfoResponseType}
                value={data?.responseType}
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
