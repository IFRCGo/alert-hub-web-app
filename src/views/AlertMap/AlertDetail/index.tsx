import { ChevronRightLineIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import { AlertsInfoQuery } from '#generated/types';

import i18n from './i18n.json';
import styles from './styles.module.css';

type Alert = NonNullable<NonNullable<NonNullable<AlertsInfoQuery['public']>['alerts']>['items']>[number];

export interface Props {
    data: Alert;
    onExpandClick: (alertId: string | undefined) => void;
}

function AlertDetail(props: Props) {
    const {
        data,
        onExpandClick,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <Container
            className={styles.alertInfo}
            heading={data?.country.name ?? '--'}
            headerClassName={styles.alertListItem}
            headingLevel={5}
            key={data.countryId}
            headerDescription={data.infos.map((alert) => alert.event)}
            actions={(
                <Button
                    name={data.countryId}
                    onClick={onExpandClick}
                    variant="tertiary"
                    title={strings.alertViewDetails}
                >
                    <ChevronRightLineIcon className={styles.icon} />
                </Button>
            )}
        />
    );
}

export default AlertDetail;
