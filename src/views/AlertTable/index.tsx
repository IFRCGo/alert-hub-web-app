import { useMemo } from 'react';
import {
    Container,
    Pager,
    Table,
} from '@ifrc-go/ui';
import { SortContext } from '@ifrc-go/ui/contexts';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    createStringColumn,
    resolveToComponent,
} from '@ifrc-go/ui/utils';

import useFilterState from '#hooks/useFilterState';
import { createLinkColumn } from '#utils/domain/tableHelpers';

import i18n from './i18n.json';
import styles from './styles.module.css';

// type EventResponse = GoApiResponse<'/api/'>;
// type EventListItem = NonNullable<EventResponse>;

// const alertKeySelector = (option: EventListItem) => option.id;

// const GET_ALERTS = gql`
//   query GetAlerts($filter: AlertFilter) {
//     alerts(filter: $filter) {
//       id
//       eventCategory
//       region
//       countries_details
//       admin
//     }
//   }
// `;

type EventListItem = {
  sent: boolean;
  id: number;
  event: string | null | undefined,
  eventCategory: string;
  region: string;
  countries_details: string[];
  admin: string;
};
const alertKeySelector = (item: EventListItem) => item.id;

// #FIX ME remove the staticData
const staticData: EventListItem[] = [
    {
        id: 1,
        event: 'Event 1',
        eventCategory: 'Category 1',
        region: 'Region 1',
        countries_details: ['Country 1'],
        admin: 'Admin 1',
        sent: true,
    },
    {
        id: 2,
        event: 'Event 2',
        eventCategory: 'Category 2',
        region: 'Region 2',
        countries_details: ['Country 2'],
        admin: 'Admin 2',
        sent: false,
    },

];

function AlertTable() {
    const strings = useTranslation(i18n);
    const {
        sortState,
        page,
        limit,
        setPage,
        filtered,
    } = useFilterState<{
      event?:string,
      eventCategory?:string
    }>({
        pageSize: 5,
        filter: {
            event: undefined,
            eventCategory: undefined,
        },
    });
    const columns = useMemo(
        () => ([
            createStringColumn<EventListItem, number>(
                'event',
                strings.alertTableEvent,
                (item) => item.event,
                { sortable: true },
            ),
            createStringColumn<EventListItem, number>(
                'event_category',
                strings.alertTableCategory,
                (item) => item.eventCategory,
                { sortable: true },
            ),
            createStringColumn<EventListItem, number>(
                'region',
                strings.alertTableRegion,
                (item) => item.region,
                { sortable: true },
            ),
            createStringColumn<EventListItem, number>(
                'country',
                strings.alertTablecounteries,
                (item) => item.countries_details[0],
                { sortable: true },
            ),
            createStringColumn<EventListItem, number>(
                'admin',
                strings.alertTableAdmins,
                (item) => item.admin,
                { sortable: true },
            ),
            createLinkColumn<EventListItem, number>(
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
            strings.alertTableviewDetailsTitle,
        ],
    );
    const heading = resolveToComponent(
        strings.allOngoingAlertTitle,
        // { numAlerts: alertResponse?.count ?? '--' },

    );
    return (
        <div className={styles.alertTable}>
            <Container
                className={styles.alertTable}
                heading={heading}
                withHeaderBorder
                childrenContainerClassName={styles.content}
                withGridViewInFilter
                footerActions={(
                    <Pager
                        activePage={page}
                        itemsCount={staticData.length}
                        maxItemsPerPage={limit}
                        onActivePageChange={setPage}
                    />
                )}
            >
                <SortContext.Provider value={sortState}>
                    <Table
                        pending={false}
                        filtered={filtered}
                        className={styles.table}
                        columns={columns}
                        keySelector={alertKeySelector}
                        data={staticData}
                    />
                </SortContext.Provider>
            </Container>
        </div>
    );
}
export default AlertTable;
