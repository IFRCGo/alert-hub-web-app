import {
    Button,
    Container,
} from '@ifrc-go/ui';

import { CountryAdmin1Query } from '#generated/types/graphql';

import styles from './styles.module.css';

type Admin1 = NonNullable<NonNullable<CountryAdmin1Query['public']>['country']>['admin1s'][number];

export interface Props {
    data: Admin1;
    onAdmin1Click: (id: string) => void;
}

function Admin1ListItem(props: Props) {
    const {
        data,
        onAdmin1Click,
    } = props;

    return (
        <Container
            className={styles.countryListItem}
            headingContainerClassName={styles.headingContainer}
            headerClassName={styles.header}
            headingClassName={styles.heading}
            heading={(
                <Button
                    name={data.id}
                    onClick={onAdmin1Click}
                    variant="tertiary"
                >
                    {data.name}
                </Button>
            )}
            headingDescription={`(${data?.filteredAlertCount})`}
            headingLevel={5}
            key={data.id}
        />
    );
}

export default Admin1ListItem;
