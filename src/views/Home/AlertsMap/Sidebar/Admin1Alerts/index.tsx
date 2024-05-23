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
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import {
    Admin1AlertsQuery,
    Admin1AlertsQueryVariables,
    Admin1DetailQuery,
    Admin1DetailQueryVariables,
    AlertFilter,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';
import { stringIdSelector } from '#utils/selectors';
import useAlertFilters from '#views/Home/useAlertFilters';

import AlertDataContext from '../../../AlertDataContext';
import AlertListItem from '../AlertListItem';

import styles from './styles.module.css';

const ADMIN1_DETAIL = gql`
query Admin1Detail(
  $admin1Id: ID!
){
  public {
    id
    admin1(pk: $admin1Id) {
      bbox
      ifrcGoId
      alertCount
      name
      id
    }
  }
}
`;

const ADMIN1_ALERTS = gql`
query Admin1Alerts(
  $pagination: OffsetPaginationInput,
  $alertFilters: AlertFilter
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

type Alert = NonNullable<NonNullable<NonNullable<Admin1AlertsQuery['public']>['alerts']>['items']>[number];

const PAGE_SIZE = 20;

interface Props {
    admin1Id: string;
}

function Admin1Alerts(props: Props) {
    const { admin1Id } = props;

    const {
        setActiveAlertId,
        setActiveAdmin1Details,
        activeAdmin1Id,
    } = useContext(AlertDataContext);
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
            });
        },
        [
            alertFilters,
            setFilter,
            activeAdmin1Id,
        ],
    );

    const variables = useMemo<Admin1AlertsQueryVariables>(() => ({
        pagination: {
            offset,
            limit,
        },
        alertFilters: filter,
    }), [
        offset,
        limit,
        filter,
    ]);

    const {
        previousData,
        data: admin1AlertList = previousData,
        error: admin1AlertError,
        loading: admin1AlertPending,
    } = useQuery<Admin1AlertsQuery, Admin1AlertsQueryVariables>(
        ADMIN1_ALERTS,
        {
            variables,
            skip: isNotDefined(activeAdmin1Id),
        },
    );

    const {
        data: admin1Details,
    } = useQuery<Admin1DetailQuery, Admin1DetailQueryVariables>(
        ADMIN1_DETAIL,
        {
            variables: { admin1Id },
            skip: isNotDefined(admin1Id),
            onCompleted: (response) => {
                setActiveAdmin1Details(response);
            },
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
            className={styles.admin1Alerts}
            childrenContainerClassName={styles.content}
            heading={admin1Details?.public.admin1?.name}
            footerActions={isDefined(admin1AlertList?.public?.alerts) && (
                <Pager
                    activePage={page}
                    itemsCount={admin1AlertList?.public?.alerts?.count ?? 0}
                    maxItemsPerPage={PAGE_SIZE}
                    onActivePageChange={setPage}
                />
            )}
            filtered={false}
            errored={isDefined(admin1AlertError)}
            pending={admin1AlertPending}
            contentViewType="vertical"
            empty={admin1AlertList?.public?.alerts?.items?.length === 0}
            headingLevel={4}
            withFooterBorder
        >
            <RawList
                data={admin1AlertList?.public?.alerts?.items}
                keySelector={stringIdSelector}
                renderer={AlertListItem}
                rendererParams={alertRendererParams}
            />
        </Container>
    );
}

export default Admin1Alerts;
