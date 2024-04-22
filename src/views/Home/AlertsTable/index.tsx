import {
    ComponentType,
    HTMLProps,
    useMemo,
} from 'react';
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
    createListDisplayColumn,
    createStringColumn,
} from '@ifrc-go/ui/utils';
import { isNotDefined } from '@togglecorp/fujs';

import {
    AlertInformationsQuery,
    AlertInformationsQueryVariables,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';
import { createLinkColumn } from '#utils/domain/tableHelpers';

import i18n from './i18n.json';
import styles from './styles.module.css';

const ALERT_INFORMATIONS = gql`
    query AlertInformations($pagination: OffsetPaginationInput) {
        public {
            alerts(pagination: $pagination) {
                limit
                offset
                count
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
                    info {
                        id
                        event
                        alertId
                        category
                    }
                }
            }
        }
    }
`;

type AlertType = NonNullable<NonNullable<NonNullable<AlertInformationsQuery['public']>['alerts']>['items']>[number];
type Country = AlertType['country'];
type Admin1 = Country['admin1s'][number];

const alertKeySelector = (item: AlertType) => item.id;
const PAGE_SIZE = 20;

function AlertsTable() {
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
        pageSize: PAGE_SIZE,
        filter: {},
    });

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
        previousData,
        data: alertInfosResponse = previousData,
    } = useQuery<AlertInformationsQuery, AlertInformationsQueryVariables>(
        ALERT_INFORMATIONS,
        {
            skip: isNotDefined(variables),
            variables,
        },
    );

    const data = alertInfosResponse?.public.alerts;

    const columns = useMemo(
        () => ([
            createStringColumn<AlertType, string>(
                'event',
                strings.alertTableEventTitle,
                (item) => item.info?.event,
                {
                    sortable: true,
                    columnClassName: styles.event,
                },
            ),
            createStringColumn<AlertType, string>(
                'category',
                strings.alertTableCategoryTitle,
                (item) => item.info?.category,
                { columnClassName: styles.category },
            ),
            createStringColumn<AlertType, string>(
                'region',
                strings.alertTableRegionTitle,
                (item) => (item.country.region.name),
                { columnClassName: styles.region },

            ),
            createStringColumn<AlertType, string>(
                'country',
                strings.alertTableCountryTitle,
                (item) => (item.country.name),
                {
                    sortable: true,
                    columnClassName: styles.country,
                },
            ),
            createListDisplayColumn<AlertType, string, Admin1, HTMLProps<HTMLSpanElement>>(
                'admin1s',
                strings.alertTableAdminsTitle,
                (item) => ({
                    list: item.country.admin1s,
                    keySelector: ({ id }) => id,
                    renderer: 'span' as unknown as ComponentType<HTMLProps<HTMLSpanElement>>,
                    rendererParams: ({ name }) => ({ children: name }),
                }),
                { columnClassName: styles.admins },
            ),
            createDateColumn<AlertType, string>(
                'sent',
                strings.alertTableSentLabel,
                (item) => (item.sent),
                { columnClassName: styles.sent },
            ),
            createLinkColumn<AlertType, string>(
                'actions',
                strings.alertTableActionsTitle,
                () => strings.alertTableViewDetailsTitle,
                (item) => ({
                    to: '/',
                    urlParams: { detailId: item.id },
                }),
                { columnClassName: styles.actions },
            ),
        ]),
        [
            strings.alertTableEventTitle,
            strings.alertTableCategoryTitle,
            strings.alertTableRegionTitle,
            strings.alertTableCountryTitle,
            strings.alertTableAdminsTitle,
            strings.alertTableSentLabel,
            strings.alertTableActionsTitle,
            strings.alertTableViewDetailsTitle,
        ],
    );

    return (
        <Container
            className={styles.alertsTable}
            heading={strings.allOngoingAlertTitle}
            withHeaderBorder
            withGridViewInFilter
            footerActions={(
                <Pager
                    activePage={page}
                    itemsCount={data?.count ?? 0}
                    maxItemsPerPage={limit}
                    onActivePageChange={setPage}
                />
            )}
        >
            <SortContext.Provider value={sortState}>
                <Table
                    pending={loading}
                    filtered={filtered}
                    columns={columns}
                    keySelector={alertKeySelector}
                    data={data?.items}
                />
            </SortContext.Provider>
        </Container>
    );
}
export default AlertsTable;
