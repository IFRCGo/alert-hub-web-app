import {
    Button,
    DateOutput,
} from '@ifrc-go/ui';

import { Admin1AlertsQuery } from '#generated/types/graphql';

import styles from './styles.module.css';

type Alert = NonNullable<NonNullable<Admin1AlertsQuery['public']>['alerts']>['items'][number];

export interface Props {
    data: Alert;
    onClick: (id: string) => void;
}
function AlertListItem(props: Props) {
    const {
        data,
        onClick,
    } = props;

    return (
        <div className={styles.alertTitleDetail}>
            <Button
                className={styles.alertListItem}
                name={data.id}
                onClick={onClick}
                variant="tertiary"
                actions={(
                    <div className={styles.tag}>
                        {data.info?.categoryDisplay}
                    </div>
                )}
            >
                {data.info?.event}
                <DateOutput
                    className={styles.tag}
                    value={data.sent}
                />
            </Button>
        </div>
    );
}

export default AlertListItem;
