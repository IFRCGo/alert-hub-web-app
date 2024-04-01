import { useMemo } from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    Container,
    Pager,
    Table,
} from '@ifrc-go/ui';
import { SortContext } from '@ifrc-go/ui/contexts';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    createBooleanColumn,
    createStringColumn,
} from '@ifrc-go/ui/utils';

import {
    PublicAlertTypeQuery,
    PublicAlertTypeQueryVariables,
} from '#generated/types';
import useFilterState from '#hooks/useFilterState';
import { createLinkColumn } from '#utils/domain/tableHelpers';

import i18n from './i18n.json';
import styles from './styles.module.css';

type AlertListItem = {
    sent: boolean;
    id: number;
    event: string | null | undefined,
    eventCategory: string;
    region: string;
    countries_details: string[];
    admin: string;
};
const alertKeySelector = (item: AlertListItem) => item.id;

const ALERT_TYPE = gql`
query  AlertType {
    public {
      alertInfos {
        items {
          event
          category
        }
      }
      region(pk: "1") {
        id
        name
      }
      country(pk: "1") {
        id
        name
      }
      admin1s {
        items {
          id
          name
        }
      }
      alert(pk: "2") {
        sent
        url
      }
    }
  }
`;

function AlertTable() {
    const strings = useTranslation(i18n);
    const {
        sortState,
        page,
        limit,
        setPage,
        filtered,
    } = useFilterState<{
        event?: string,
        eventCategory?: string
    }>({
        pageSize: 5,
        filter: {},
    });

    const columns = useMemo(
        () => ([
            createStringColumn<AlertListItem, number>(
                'event',
                strings.alertTableEvent,
                (item) => item.event,
                { sortable: true },
            ),
            createStringColumn<AlertListItem, number>(
                'event_category',
                strings.alertTableCategory,
                (item) => item.eventCategory,
            ),
            createStringColumn<AlertListItem, number>(
                'region',
                strings.alertTableRegion,
                (item) => item.region,
            ),
            createStringColumn<AlertListItem, number>(
                'countries_details',
                strings.alertTablecounteries,
                (item) => (item.countries_details ? item.countries_details.join(', ') : ''),
            ),

            createStringColumn<AlertListItem, number>(
                'admin',
                strings.alertTableAdmins,
                (item) => item.admin,
            ),
            createBooleanColumn<AlertListItem, number>(
                'sent',
                strings.alertTableSent,
                (item) => item.sent,
            ),
            createLinkColumn<AlertListItem, number>(
                'view_details',
                strings.alertTableviewDetailsTitle,
                () => 'View Details',
                (item) => ({
                    to: 'detailsLayout',
                    urlParams: { detailId: item.id },
                }),
            ),
        ]),
        [
            strings.alertTableEvent,
            strings.alertTableCategory,
            strings.alertTableRegion,
            strings.alertTablecounteries,
            strings.alertTableAdmins,
            strings.alertTableSent,
            strings.alertTableviewDetailsTitle,
        ],
    );
    const {
        loading,
        data: alertInfoResponse,
    } = useQuery<PublicAlertTypeQuery, PublicAlertTypeQueryVariables>(
        ALERT_TYPE,
    );

    return (
        <div className={styles.alertTable}>
            <Container
                className={styles.alertTable}
                heading={strings.allOngoingAlertTitle}
                withHeaderBorder
                childrenContainerClassName={styles.content}
                withGridViewInFilter
                footerActions={(
                    <Pager
                        activePage={page}
                        itemsCount={alertInfoResponse?.public.alertInfos.items.length}
                        maxItemsPerPage={limit}
                        onActivePageChange={setPage}
                    />
                )}
            >
                <SortContext.Provider value={sortState}>
                    <Table
                        pending={loading}
                        filtered={filtered}
                        className={styles.table}
                        columns={columns}
                        keySelector={alertKeySelector}
                        data={alertInfoResponse?.public?.alertInfos.items}
                    />
                </SortContext.Provider>
            </Container>
        </div>
    );
}
export default AlertTable;
