import { ChevronRightLineIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import { CountryListQuery } from '#generated/types';

import i18n from './i18n.json';
import styles from './styles.module.css';

type CountryType = NonNullable<NonNullable<NonNullable<CountryListQuery['public']>['countries']>['items']>[number];

export interface Props {
    data: CountryType;
    onExpandClick: (alertId: string | undefined) => void;
}

function CountryListItem(props: Props) {
    const {
        data,
        onExpandClick,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <Container
            className={styles.countryInfo}
            heading={data.name ?? '--'}
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
