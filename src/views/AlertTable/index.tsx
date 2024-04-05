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
    createDateColumn,
    createStringColumn,
} from '@ifrc-go/ui/utils';
import { isNotDefined } from '@togglecorp/fujs';

import {
    AlertInformationsQuery,
    AlertInformationsQueryVariables,
} from '#generated/types';
import useFilterState from '#hooks/useFilterState';
import { createLinkColumn } from '#utils/domain/tableHelpers';

import i18n from './i18n.json';
import styles from './styles.module.css';

type AlertType = NonNullable<NonNullable<NonNullable<AlertInformationsQuery['public']>['alerts']>['items']>[number];
const alertKeySelector = (item: AlertType) => item.id;

const ALERT_INFORMATIONS = gql`
    query AlertInformations($pagination: OffsetPaginationInput) {
        public {
            alerts(pagination: $pagination) {
                limit
                offset
                items {
                    id
                    country {
                        id
                        name
                        admin1s {
                            id
                            name
                        }
                        region {
                            id
                            name
                        }
                    }
                    sent
                    url
                    infos {
                        event
                        category
                    }
                }
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
        pageSize: 7,
        filter: {},
    });

    const columns = useMemo(
        () => ([
            createStringColumn<AlertType, string>(
                'event',
                strings.alertTableEvent,
                (item) => (item.infos.map((info: { event: string; }) => info.event).join(', ')),
                { sortable: true },
            ),
            createStringColumn<AlertType, string>(
                'category',
                strings.alertTableCategory,
                (item) => (item.infos.map((info: { category: string; }) => info.category).join(',')),
            ),
            createStringColumn<AlertType, string>(
                'region',
                strings.alertTableRegion,
                (item) => (item.country.region.name),

            ),
            createStringColumn<AlertType, string>(
                'countries_details',
                strings.alertTablecounteries,
                (item) => (item.country.name),
                { sortable: true },
            ),

            createStringColumn<AlertType, string>(
                'admin',
                strings.alertTableAdmins,
                (item) => (item.country.admin1s.map((admin: { name: string; }) => admin.name).join(', ')),
            ),
            createDateColumn<AlertType, string>(
                'sent',
                strings.alertTableSent,
                (item) => (item.sent),
            ),
            createLinkColumn<AlertType, string>(
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

    const variables = useMemo(() => ({
        pagination: {
            offset: page,
            limit,
        },
    }), [
        page,
        limit,
    ]);

    const {
        loading,
        data: alertInfosResponse,
    } = useQuery<AlertInformationsQuery, AlertInformationsQueryVariables>(
        ALERT_INFORMATIONS,
        {
            skip: isNotDefined(variables),
            variables,
        },
    );

    const itemsCount = alertInfosResponse?.public.alerts.count || 0;
    const items = alertInfosResponse?.public.alerts.items;

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
                        itemsCount={itemsCount}
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
                        data={items}
                    />
                </SortContext.Provider>
            </Container>
        </div>
    );
}
export default AlertTable;
