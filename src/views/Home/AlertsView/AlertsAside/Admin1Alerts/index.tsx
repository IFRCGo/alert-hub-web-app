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

import AlertContext from '../../../AlertContext';
import AlertListItem from '../AlertListItem';

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
    const { setActiveAlertId, setBbox } = useContext(AlertContext);
    const alertFilters = useAlertFilters();

    const [activePage, setActivePage] = useState(1);

    const variables = useMemo(() => ({
        pagination: {
            offset: (activePage - 1) * MAX_ITEM_PER_PAGE,
            limit: MAX_ITEM_PER_PAGE,
        },
        alertFilters: {
            ...alertFilters,
            admin1Id: {
                pk: admin1Id,
            },
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
                setBbox(response.public.admin1?.bbox);
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
            heading={admin1Details?.public.admin1?.name}
            footerActions={(
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
