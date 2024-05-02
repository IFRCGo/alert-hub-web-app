import {
    ComponentType,
    HTMLProps,
    useContext,
    useEffect,
    useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { ArrowDropRightLineIcon } from '@ifrc-go/icons';
import {
    Container,
    DateOutput,
    DateOutputProps,
    Pager,
    Table,
} from '@ifrc-go/ui';
import { SortContext } from '@ifrc-go/ui/contexts';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    createElementColumn,
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

import AlertContext from '../AlertContext';
import useAlertFilters from '../useAlertFilters';
import AlertActions, { type Props as AlertActionsProps } from './AlertActions';

import i18n from './i18n.json';
import styles from './styles.module.css';

const ALERT_INFORMATIONS = gql`
    query AlertInformations(
        $order:AlertOrder,
        $pagination: OffsetPaginationInput,
        $filters: AlertFilter,
        ) {
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
                        categoryDisplay
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
    const {
        activeCountryId,
        activeAdmin1Id,
        activeRegionId,
        selectedCategoryTypes,
        startDateFrom,
        startDateTo,
    } = useContext(AlertContext);

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
                region: activeRegionId,
                category: selectedCategoryTypes,
                sent: isDefined(startDateFrom) && isDefined(startDateTo) ? {
                    range: {
                        end: startDateTo,
                        start: startDateFrom,
                    },
                } : undefined,
            });
        },
        [
            alertFilters,
            setFilter,
            activeCountryId,
            activeAdmin1Id,
            activeRegionId,
            selectedCategoryTypes,
            startDateFrom,
            startDateTo,
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
        loading: alertInfoLoading,
        previousData,
        data: alertInfosResponse = previousData,
        error: alertInfoError,
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
                (item) => item.info?.categoryDisplay,
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
            createElementColumn<AlertType, string, DateOutputProps>(
                'sent',
                strings.alertTableSentLabel,
                DateOutput,
                (_, item) => ({
                    value: item.sent,
                    format: 'MM/dd/yyyy hh:mm:ss',
                }),
                {
                    sortable: true,
                    columnClassName: styles.sent,
                },
            ),
            createElementColumn<AlertType, string, AlertActionsProps>(
                'actions',
                strings.alertTableActionsTitle,
                AlertActions,
                (_, item) => ({ alert: item }),
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
            actions={(
                <Link
                    className={styles.sources}
                    to={routes.allSourcesFeeds.absolutePath}
                >
                    {strings.tableViewAllSources}
                    <ArrowDropRightLineIcon className={styles.icon} />
                </Link>
            )}
            overlayPending
            pending={alertInfoLoading}
            errored={isDefined(alertInfoError)}
            errorMessage={alertInfoError?.message}
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
                    pending={alertInfoLoading}
                    filtered={filtered}
                    errored={isDefined(alertInfoError)}
                    columns={columns}
                    keySelector={alertKeySelector}
                    data={data?.items}
                />
            </SortContext.Provider>
        </Container>
    );
}
export default AlertsTable;
