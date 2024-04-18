import {
    Button,
    Container,
    Header,
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
        >
            <Button
                name={data.id}
                onClick={onCountryClick}
                variant="tertiary"
            >
                <Header
                    headingLevel={5}
                    heading={data.info?.event}
                    headingDescription={data.info?.category}
                    headingContainerClassName={styles.info}
                />
            </Button>
        </Container>
    );
}

export default AlertListItem;
