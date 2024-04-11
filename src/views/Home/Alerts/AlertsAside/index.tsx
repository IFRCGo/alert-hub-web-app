import { useCallback } from 'react';
import {
    Container,
    List,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { _cs } from '@togglecorp/fujs';

import { CountryListQuery } from '#generated/types';
import { stringIdSelector } from '#utils/selectors';

import CountryListItem from './CountryListItem';

import i18n from './i18n.json';
import styles from './styles.module.css';

type CountryType = NonNullable<NonNullable<CountryListQuery['public']>['allCountries']>[number];

interface Props {
    className?: string;
    countriesWithAlert?: CountryType[];
    alertsPending: boolean;
    alertsFetchError: boolean;
    alertsFiltered: boolean;
}

function AlertsAside(props: Props) {
    const {
        className,
        countriesWithAlert,
        alertsPending,
        alertsFetchError,
        alertsFiltered,
    } = props;

    const strings = useTranslation(i18n);

    const handleCountryClick = useCallback((id: string) => {
        console.warn('id', id);
    }, []);

    const rendererParams = useCallback(
        (_: string, value: CountryType) => ({
            data: value,
            onCountryClick: handleCountryClick,
        }),
        [handleCountryClick],
    );

    return (
        <Container
            className={_cs(styles.alertAside, className)}
            heading={strings.heading}
            withHeaderBorder
            childrenContainerClassName={styles.mainContent}
        >
            <List
                className={styles.countryList}
                data={countriesWithAlert}
                keySelector={stringIdSelector}
                renderer={CountryListItem}
                errored={alertsFetchError}
                pending={alertsPending}
                filtered={alertsFiltered}
                rendererParams={rendererParams}
                compact
            />
        </Container>
    );
}

export default AlertsAside;
