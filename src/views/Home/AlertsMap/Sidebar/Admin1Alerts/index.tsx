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
    Admin1AlertsQuery,
    Admin1AlertsQueryVariables,
    Admin1DetailQuery,
    Admin1DetailQueryVariables,
} from '#generated/types/graphql';
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

type Alert = NonNullable<NonNullable<NonNullable<Admin1AlertsQuery['public']>['alerts']>['items']>[number];

const MAX_ITEM_PER_PAGE = 20;

interface Props {
    admin1Id: string;
}

function Admin1Alerts(props: Props) {
    const { admin1Id } = props;
    const { setActiveAlertId, setActiveAdmin1Details } = useContext(AlertDataContext);
    const alertFilters = useAlertFilters();

    const [activePage, setActivePage] = useState(1);

    const variables = useMemo<Admin1AlertsQueryVariables>(() => ({
        pagination: {
            offset: (activePage - 1) * MAX_ITEM_PER_PAGE,
            limit: MAX_ITEM_PER_PAGE,
        },
        alertFilters: {
            ...alertFilters,
            admin1: admin1Id,
        },
    }), [
        activePage,
        admin1Id,
        alertFilters,
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
            skip: isNotDefined(admin1Id),
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
                    activePage={activePage}
                    itemsCount={admin1AlertList?.public?.alerts?.count ?? 0}
                    maxItemsPerPage={MAX_ITEM_PER_PAGE}
                    onActivePageChange={setActivePage}
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
