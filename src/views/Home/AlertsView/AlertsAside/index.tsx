import {
    useCallback,
    useContext,
} from 'react';
import { ChevronLeftLineIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
    RawList,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    _cs,
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import { CountryListQuery } from '#generated/types/graphql';
import { stringIdSelector } from '#utils/selectors';

import AlertContext from '../AlertContext';
import CountryDetail from './CountryDetail';
import CountryListItem from './CountryListItem';

import i18n from './i18n.json';
import styles from './styles.module.css';

type Country = NonNullable<NonNullable<CountryListQuery['public']>['allCountries']>[number];

interface Props {
    className?: string;
    countriesWithAlert?: Country[];
}

export type TabKeys = 'admin1' | 'alert';

function AlertsAside(props: Props) {
    const {
        className,
        countriesWithAlert,
    } = props;

    const strings = useTranslation(i18n);

    const { activeCountryId, activeCountryName, setActiveCountryId } = useContext(AlertContext);

    const countryRendererParams = useCallback(
        (_: string, value: Country) => ({
            data: value,
            onCountryClick: setActiveCountryId,
        }),
        [setActiveCountryId],
    );

    return (
        <Container
            className={_cs(styles.alertAside, className)}
            heading={
                isNotDefined(activeCountryId)
                    ? strings.alertCountries
                    : activeCountryName ?? '--'
            }
            withHeaderBorder
            childrenContainerClassName={styles.mainContent}
            actions={isDefined(activeCountryId) && (
                <Button
                    name={undefined}
                    onClick={setActiveCountryId}
                    variant="tertiary"
                    icons={(
                        <ChevronLeftLineIcon className={styles.icon} />
                    )}
                >
                    {strings.alertBack}
                </Button>
            )}
            withInternalPadding
            contentViewType="vertical"
        >
            {isNotDefined(activeCountryId) && (
                <RawList
                    data={countriesWithAlert}
                    keySelector={stringIdSelector}
                    renderer={CountryListItem}
                    rendererParams={countryRendererParams}
                />
            )}
            {isDefined(activeCountryId) && (
                <CountryDetail
                    countryId={activeCountryId}
                />
            )}
        </Container>
    );
}

export default AlertsAside;
