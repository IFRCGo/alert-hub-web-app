import {
    TabPanel,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import { AlertInfoQuery } from '#generated/types/graphql';

import i18n from './i18n.json';
import styles from './styles.module.css';

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
            className={styles.alertInfo}
        >
            <TextOutput
                label={strings.alertInfoCategory}
                value={data?.certaintyDisplay}
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
        </TabPanel>
    );
}

export default AlertInfo;
