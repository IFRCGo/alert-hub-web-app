import { useCallback } from 'react';
import { DateOutput } from '@ifrc-go/ui';

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

    const handleClick = useCallback(
        () => {
            onClick(data.id);
        },
        [onClick, data.id],
    );

    return (
        <div
            className={styles.alertListItem}
            onClick={handleClick}
            role="presentation"
        >
            <div className={styles.event}>
                {data.info?.event}
            </div>
            <div className={styles.additionalInfo}>
                <DateOutput
                    className={styles.date}
                    value={data?.sent}
                    format="MM/dd/yyyy hh:mm:ss"
                />
                <div className={styles.tag}>
                    {data.info?.categoryDisplay}
                </div>
            </div>
        </div>
    );
}

export default AlertListItem;
