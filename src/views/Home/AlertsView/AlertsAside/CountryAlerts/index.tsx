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

import AlertContext from '../../../AlertContext';
import AlertListItem from '../AlertListItem';

const COUNTRY_ALERTS = gql`
query CountryAlerts(
  $countryId: ID!,
  $pagination: OffsetPaginationInput
){
  public {
    id
    alerts(
      filters: {country: {pk: $countryId}}
      pagination: $pagination
    ) {
      count
      items {
        id
        info {
          event
          categoryDisplay
        }
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
    const { setActiveAlertId } = useContext(AlertContext);

    const [activePage, setActivePage] = useState(1);

    const variables = useMemo(() => ({
        countryId,
        pagination: {
            offset: (activePage - 1) * MAX_ITEM_PER_PAGE,
            limit: MAX_ITEM_PER_PAGE,
        },
    }), [
        activePage,
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
            footerActions={(
                <Pager
                    activePage={activePage}
                    itemsCount={countryAlertList?.public?.alerts?.count ?? 0}
                    maxItemsPerPage={MAX_ITEM_PER_PAGE}
                    onActivePageChange={setActivePage}
                />
            )}
            // TODO: add filtered state
            filtered={false}
            errored={isDefined(countryAlertError)}
            pending={countryAlertPending}
            contentViewType="vertical"
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
