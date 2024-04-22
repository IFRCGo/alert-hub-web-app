import { Button } from '@ifrc-go/ui';

import { CountryAlertsQuery } from '#generated/types/graphql';

import styles from './styles.module.css';

type Alert = NonNullable<NonNullable<CountryAlertsQuery['public']>['alerts']>['items'][number];

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
        </Button>
    );
}

export default AlertListItem;
