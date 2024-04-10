import { ChevronRightLineIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import { CountryListQuery } from '#generated/types';

import i18n from './i18n.json';
import styles from './styles.module.css';

type CountryType = NonNullable<NonNullable<CountryListQuery['public']>['allCountries']>[number];

export interface CountryProps {
    data: CountryType;
    onExpandClick: (alertId: string | undefined) => void;
    bbox?: number[][] | undefined;
}

function CountryListItem(props: CountryProps) {
    const {
        data,
        onExpandClick,
        bbox,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <Container
            className={styles.countryInfo}
            heading={`${data.name ?? '--'} (${data.alertCount})`}
            headerClassName={styles.CountryListItem}
            headingLevel={5}
            key={data.name}
            actions={(
                <Button
                    name={data.id}
                    onClick={onExpandClick}
                    variant="tertiary"
                    title={strings.countryViewDetails}
                >
                    <ChevronRightLineIcon className={styles.icon} />
                </Button>
            )}
        />
    );
}

export default CountryListItem;
