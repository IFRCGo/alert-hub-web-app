import {
    useCallback,
    useContext,
    useMemo,
    useState,
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
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import {
    CountryAlertsQuery,
    CountryAlertsQueryVariables,
} from '#generated/types/graphql';
import { stringIdSelector } from '#utils/selectors';
import useAlertFilters from '#views/Home/useAlertFilters';

import AlertDataContext from '../../../AlertDataContext';
import AlertListItem from '../AlertListItem';

import styles from './styles.module.css';

const COUNTRY_ALERTS = gql`
query CountryAlerts(
  $pagination: OffsetPaginationInput,
  $alertFilters: AlertFilter
){
  public {
    id
    alerts(
      filters: $alertFilters,
      pagination: $pagination,
    ) {
      count
      items {
        id
        info {
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

const MAX_ITEM_PER_PAGE = 15;

interface Props {
    countryId: string;
}

function CountryAlerts(props: Props) {
    const { countryId } = props;
    const { setActiveAlertId } = useContext(AlertDataContext);
    const alertFilters = useAlertFilters();

    const [activePage, setActivePage] = useState(1);

    const variables = useMemo(() => ({
        pagination: {
            offset: (activePage - 1) * MAX_ITEM_PER_PAGE,
            limit: MAX_ITEM_PER_PAGE,
        },
        alertFilters: {
            ...alertFilters,
            country: {
                pk: countryId,
            },
        },
    }), [
        activePage,
        alertFilters,
        countryId,
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
                    activePage={activePage}
                    itemsCount={countryAlertList?.public?.alerts?.count}
                    maxItemsPerPage={MAX_ITEM_PER_PAGE}
                    onActivePageChange={setActivePage}
                />
            )}
            filtered={false}
            errored={isDefined(countryAlertError)}
            errorMessage={countryAlertError?.message}
            pending={countryAlertPending}
            contentViewType="vertical"
            childrenContainerClassName={styles.mainContent}
            withFooterBorder
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
