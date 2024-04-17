import {
    Button,
    Container,
} from '@ifrc-go/ui';

import { CountryAlertsListQuery } from '#generated/types/graphql';

import styles from './styles.module.css';

type Alert = NonNullable<NonNullable<CountryAlertsListQuery['public']>['alerts']>['items'][number];

export interface Props {
    data: Alert;
    onCountryClick: (id: string) => void;
}

function AlertListItem(props: Props) {
    const {
        data,
        onCountryClick,
    } = props;

    return (
        <Container
            className={styles.alertListItem}
            headingContainerClassName={styles.headingContainer}
            headerClassName={styles.header}
            headingClassName={styles.heading}
            headingLevel={5}
            heading={(
                <Button
                    name={data.id}
                    onClick={onCountryClick}
                    variant="tertiary"
                >
                    {data.info?.event}
                    {' '}
                    -
                    {data.info?.category}
                </Button>
            )}
        />
    );
}

export default AlertListItem;
