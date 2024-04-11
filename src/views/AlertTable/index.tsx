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

const alertKeySelector = (item: AlertType) => item.id;
const PAGE_SIZE = 10;

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
                { sortable: true },
            ),
            createStringColumn<AlertType, string>(
                'category',
                strings.alertTableCategoryTitle,
                (item) => item.info?.category,
            ),
            createStringColumn<AlertType, string>(
                'region',
                strings.alertTableRegionTitle,
                (item) => (item.country.region.name),

            ),
            createStringColumn<AlertType, string>(
                'countries_details',
                strings.alertTableCountryTitle,
                (item) => (item.country.name),
                { sortable: true },
            ),

            createStringColumn<AlertType, string>(
                'admin',
                strings.alertTableAdminsTitle,
                (item) => item.country.admin1s?.map((admin) => admin?.name)?.join(', '),
            ),
            createDateColumn<AlertType, string>(
                'sent',
                strings.alertTableSentLabel,
                (item) => (item.sent),
            ),
            createLinkColumn<AlertType, string>(
                'view_details',
                strings.alertTableViewDetailsTitle,
                () => strings.alertTableViewDetailsTitle,
                (item) => ({
                    to: '/',
                    urlParams: { detailId: item.id },
                }),
            ),
        ]),
        [
            strings.alertTableEventTitle,
            strings.alertTableCategoryTitle,
            strings.alertTableRegionTitle,
            strings.alertTableCountryTitle,
            strings.alertTableAdminsTitle,
            strings.alertTableSentLabel,
            strings.alertTableViewDetailsTitle,
        ],
    );

    return (
        <Container
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
export default AlertTable;
