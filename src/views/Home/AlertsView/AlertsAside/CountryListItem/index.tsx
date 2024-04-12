import {
    Button,
    Container,
} from '@ifrc-go/ui';

import { CountryListQuery } from '#generated/types/graphql';

import styles from './styles.module.css';

type Country = NonNullable<NonNullable<CountryListQuery['public']>['allCountries']>[number];

export interface CountryProps {
    data: Country;
    onCountryClick: (id: string) => void;
}

function CountryListItem(props: CountryProps) {
    const {
        data,
        onCountryClick,
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
                    onClick={onCountryClick}
                    variant="tertiary"
                >
                    {data.name}
                </Button>
            )}
            headingDescription={`(${data.filteredAlertCount})`}
            headingLevel={5}
            key={data.id}
        />
    );
}

export default CountryListItem;
