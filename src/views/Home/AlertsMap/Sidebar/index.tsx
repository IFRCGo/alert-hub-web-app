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
import ListItem from './ListItem';

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
            id: value.id,
            count: value.filteredAlertCount ?? 0,
            name: value.name,
            onListItemClick: setActiveCountryId,
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
            heading={isNotDefined(activeCountryId)
                ? strings.alertCountries
                : activeCountryDetails?.public.country?.name ?? '--'}
            withHeaderBorder
            headerActions={isDefined(activeCountryId) && (
                <Button
                    name={undefined}
                    onClick={handleBackClick}
                    styleVariant="action"
                    before={(
                        <ChevronLeftLineIcon className={styles.icon} />
                    )}
                >
                    {strings.alertBack}
                </Button>
            )}
            empty={countriesWithAlert?.length === 0}
            emptyMessage={strings.alertEmptyMessage}
            withPadding
            withContentOverflow
        >
            {isNotDefined(activeCountryId) && (
                <RawList
                    data={countriesWithAlert}
                    renderer={ListItem}
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
