import {
    ComponentType,
    HTMLProps,
    useContext,
    useEffect,
    useMemo,
} from 'react';
import { generatePath } from 'react-router-dom';
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
    resolveToString,
} from '@ifrc-go/ui/utils';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import {
    AlertFilter,
    AlertInformationsQuery,
    AlertInformationsQueryVariables,
    OffsetPaginationInput,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';
import routes from '#routes';
import { createLinkColumn } from '#utils/domain/tableHelpers';

import AlertContext from '../AlertContext';
import useAlertFilters from '../useAlertFilters';

import i18n from './i18n.json';
import styles from './styles.module.css';

const ALERT_INFORMATIONS = gql`
    query AlertInformations($order:AlertOrder, $pagination: OffsetPaginationInput, $filters: AlertFilter) {
        public {
            alerts(pagination: $pagination, filters: $filters, order:$order) {
                limit
                offset
                count
                items {
                    id
                    country {
                        id
                        name
                        region {
                            id
                            name
                        }
                    }
                    admin1s {
                        id
                        name
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
type Admin1 = AlertType['admin1s'][number];

const alertKeySelector = (item: AlertType) => item.id;
const PAGE_SIZE = 20;
const ASC = 'ASC';
const DESC = 'DESC';

function AlertsTable() {
    const strings = useTranslation(i18n);
    const alertFilters = useAlertFilters();
    const { activeCountryId, activeAdmin1Id } = useContext(AlertContext);

    const {
        sortState,
        limit,
        page,
        setPage,
        filter,
        setFilter,
        filtered,
        offset,
    } = useFilterState<AlertFilter>({
        pageSize: PAGE_SIZE,
        filter: {},
    });

    useEffect(
        () => {
            setFilter({
                ...alertFilters,
                country: isDefined(activeCountryId) ? { pk: activeCountryId } : undefined,
                admin1: activeAdmin1Id,
            });
        },
        [
            alertFilters,
            setFilter,
            activeCountryId,
            activeAdmin1Id,
        ],
    );

    const order = useMemo(() => {
        if (isNotDefined(sortState.sorting)) {
            return undefined;
        }
        return {
            [sortState.sorting.name]: sortState.sorting.direction === 'asc' ? ASC : DESC,
        };
    }, [sortState.sorting]);

    const variables = useMemo<{ filters: AlertFilter, pagination: OffsetPaginationInput }>(() => ({
        pagination: {
            offset,
            limit,
        },
        order,
        filters: filter,
    }), [
        limit,
        order,
        offset,
        filter,
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
                { columnClassName: styles.event },
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
                { columnClassName: styles.country },
            ),
            createListDisplayColumn<AlertType, string, Admin1, HTMLProps<HTMLSpanElement>>(
                'admin1s',
                strings.alertTableAdminsTitle,
                (item) => ({
                    list: item.admin1s,
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
                {
                    sortable: true,
                    columnClassName: styles.sent,
                },
            ),
            createLinkColumn<AlertType, string>(
                'actions',
                strings.alertTableActionsTitle,
                () => strings.alertTableViewDetailsTitle,
                (item) => ({
                    to: generatePath(
                        routes.alertDetails.absolutePath,
                        { alertId: item.id },
                    ),
                }),
                {
                    columnClassName: styles.actions,
                    cellRendererClassName: styles.viewDetails,
                },
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
    const heading = resolveToString(
        strings.allOngoingAlertTitle,
        { numAppeals: data?.count ?? '--' },
    );

    return (
        <Container
            className={styles.alertsTable}
            heading={heading}
            withHeaderBorder
            withGridViewInFilter
            footerActions={isDefined(data) && (
                <Pager
                    activePage={page}
                    itemsCount={data?.count}
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
