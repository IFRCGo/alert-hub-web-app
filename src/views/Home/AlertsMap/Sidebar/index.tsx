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

import { FilteredCountryListQuery } from '#generated/types/graphql';
import { stringIdSelector } from '#utils/selectors';

import AlertDataContext from '../../AlertDataContext';
import CountryDetail from './CountryDetail';
import CountryListItem from './CountryListItem';

import i18n from './i18n.json';
import styles from './styles.module.css';

type Country = NonNullable<NonNullable<FilteredCountryListQuery['public']>['allCountries']>[number];

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

    const {
        activeCountryId,
        activeAlertId,
        activeAdmin1Id,
        setActiveCountryId,
        setActiveAlertId,
        activeCountryDetails,
        setActiveAdmin1Id,
    } = useContext(AlertDataContext);

    const countryRendererParams = useCallback(
        (_: string, value: Country) => ({
            data: value,
            onCountryClick: setActiveCountryId,
        }),
        [setActiveCountryId],
    );

    const handleBackClick = useCallback(
        () => {
            if (isDefined(activeAlertId)) {
                setActiveAlertId(undefined);
            } else if (isDefined(activeAdmin1Id)) {
                setActiveAdmin1Id(undefined);
            } else {
                setActiveCountryId(undefined);
            }
        },
        [
            activeAlertId,
            activeAdmin1Id,
            setActiveCountryId,
            setActiveAlertId,
            setActiveAdmin1Id,
        ],
    );

    return (
        <Container
            className={_cs(styles.alertAside, className)}
            heading={
                isNotDefined(activeCountryId)
                    ? strings.alertCountries
                    : activeCountryDetails?.public.country?.name ?? '--'
            }
            withHeaderBorder
            childrenContainerClassName={styles.mainContent}
            actions={isDefined(activeCountryId) && (
                <Button
                    name={undefined}
                    onClick={handleBackClick}
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
            empty={countriesWithAlert?.length === 0}
        >
            {isNotDefined(activeCountryId) && (
                <RawList
                    data={countriesWithAlert}
                    renderer={CountryListItem}
                    rendererParams={countryRendererParams}
                    keySelector={stringIdSelector}
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
