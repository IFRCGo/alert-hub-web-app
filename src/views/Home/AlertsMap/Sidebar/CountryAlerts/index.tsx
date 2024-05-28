import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    Container,
    Pager,
    RawList,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import {
    AlertFilter,
    CountryAlertsQuery,
    CountryAlertsQueryVariables,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';
import { stringIdSelector } from '#utils/selectors';
import useAlertFilters from '#views/Home/useAlertFilters';

import AlertDataContext from '../../../AlertDataContext';
import AlertListItem from '../AlertListItem';

import i18n from './i18n.json';
import styles from './styles.module.css';

const COUNTRY_ALERTS = gql`
query CountryAlerts(
  $pagination: OffsetPaginationInput,
  $alertFilters: AlertFilter,
){
  public {
    id
    alerts(
      filters: $alertFilters,
      order: {sent: DESC},
      pagination: $pagination,
    ) {
      count
      items {
        id
        info {
          id
          event
          categoryDisplay
        }
        sent
      }
    }
  }
}
`;

type Alert = NonNullable<NonNullable<NonNullable<CountryAlertsQuery['public']>['alerts']>['items']>[number];

const PAGE_SIZE = 15;

interface Props {
    countryId: string;
}

function CountryAlerts(props: Props) {
    const { countryId } = props;

    const strings = useTranslation(i18n);
    const { setActiveAlertId, activeCountryId } = useContext(AlertDataContext);
    const alertFilters = useAlertFilters();

    const {
        limit,
        page,
        setPage,
        filter,
        setFilter,
        offset,
    } = useFilterState<AlertFilter>({
        pageSize: PAGE_SIZE,
        filter: {},
    });

    useEffect(
        () => {
            setFilter({
                ...alertFilters,
                country: isDefined(activeCountryId) ? { pk: activeCountryId } : undefined,
            });
        },
        [
            alertFilters,
            setFilter,
            activeCountryId,
        ],
    );

    const variables = useMemo<CountryAlertsQueryVariables>(() => ({
        pagination: {
            offset,
            limit,
        },
        alertFilters: filter,
    }), [
        limit,
        offset,
        filter,
    ]);

    const {
        previousData,
        data: countryAlertList = previousData,
        error: countryAlertError,
        loading: countryAlertPending,
    } = useQuery<CountryAlertsQuery, CountryAlertsQueryVariables>(
        COUNTRY_ALERTS,
        {
            variables,
            skip: isNotDefined(countryId),
        },
    );

    const alertRendererParams = useCallback(
        (_: string, value: Alert) => ({
            data: value,
            onClick: setActiveAlertId,
        }),
        [setActiveAlertId],
    );

    return (
        <Container
            className={styles.countryAlerts}
            footerActions={isDefined(countryAlertList?.public?.alerts) && (
                <Pager
                    activePage={page}
                    itemsCount={countryAlertList?.public?.alerts?.count}
                    maxItemsPerPage={PAGE_SIZE}
                    onActivePageChange={setPage}
                />
            )}
            filtered={false}
            errored={isDefined(countryAlertError)}
            errorMessage={countryAlertError?.message}
            pending={countryAlertPending}
            contentViewType="vertical"
            childrenContainerClassName={styles.mainContent}
            withFooterBorder
            empty={countryAlertList?.public?.alerts?.items?.length === 0}
            emptyMessage={strings.alertEmptyMessage}
        >
            <RawList
                data={countryAlertList?.public?.alerts?.items}
                keySelector={stringIdSelector}
                renderer={AlertListItem}
                rendererParams={alertRendererParams}
            />
        </Container>
    );
}

export default CountryAlerts;
