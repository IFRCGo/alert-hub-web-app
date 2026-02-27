import { useCallback } from 'react';
import {
    DateOutput,
    Description,
    Heading,
    ListView,
} from '@ifrc-go/ui';

import { Admin1AlertsQuery } from '#generated/types/graphql';
import { DATE_FORMAT } from '#utils/constants';

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
        <ListView
            layout="block"
            withPadding
            spacing="3xs"
            className={styles.alertListItem}
            onClick={handleClick}
        >
            <Heading
                level={5}
            >
                {data.info?.event}
            </Heading>
            <ListView>
                <Description
                    textSize="sm"
                    withLightText
                >
                    <DateOutput
                        value={data?.sent}
                        format={DATE_FORMAT}
                    />
                </Description>
                <div className={styles.tag}>
                    {data.info?.categoryDisplay}
                </div>
            </ListView>
        </ListView>
    );
}

export default AlertListItem;
