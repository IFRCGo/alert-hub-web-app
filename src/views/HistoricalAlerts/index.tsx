import {
    ComponentType,
    HTMLProps,
    useCallback,
    useMemo,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { ChevronRightLineIcon } from '@ifrc-go/icons';
import {
    Container,
    DateInput,
    DateOutput,
    DateOutputProps,
    MultiSelectInput,
    Pager,
    SelectInput,
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
    PartialForm,
    useFormObject,
} from '@togglecorp/toggle-form';

import Link from '#components/Link';
import Page from '#components/Page';
import {
    AlertEnumsAndAllCountryListQuery,
    AlertEnumsAndAllCountryListQueryVariables,
    AlertEnumsQuery,
    AlertFilter,
    AlertInfoFilter,
    AlertInformationsQuery,
    AlertInformationsQueryVariables,
    FilteredAdminListQuery,
    FilteredAdminListQueryVariables,
    OffsetPaginationInput,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';
import { DATE_FORMAT } from '#utils/constants';
import {
    stringIdSelector,
    stringNameSelector,
} from '#utils/selectors';
import AlertFilters from '#views/Home/AlertFilters';

import AlertActions, { type Props as AlertActionsProps } from './AlertActions';

import i18n from './i18n.json';
import styles from './styles.module.css';

const HISTORICAL_ALERTS = gql`
    query historicalAlerts(
        $pagination: OffsetPaginationInput,
        $filters: AlertFilter,
    ) {
        public {
            id
            alerts(
                pagination: $pagination,
                filters: $filters,
            ) {
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

const ALERT_ENUMS_AND_ALL_COUNTRY = gql`
query AlertEnumsAndAllCountryList {
    enums {
        AlertInfoCertainty {
            key
            label
        }
        AlertInfoUrgency {
            key
            label
        }
        AlertInfoSeverity {
            key
            label
        }
        AlertInfoCategory {
            key
            label
        }
    }
    public {
        id
        allCountries {
            name
            id
        }
    }
}
`;

const ADMIN_LIST = gql`
query FilteredAdminList($filters: Admin1Filter, $pagination: OffsetPaginationInput) {
    public {
        id
        admin1s(filters: $filters, pagination: $pagination) {
            items {
                id
                name
                countryId
                alertCount
            }
        }
    }
}
`;

type AdminOption = NonNullable<NonNullable<NonNullable<FilteredAdminListQuery['public']>['admin1s']>['items']>[number];
type Urgency = NonNullable<AlertEnumsQuery['enums']['AlertInfoUrgency']>[number];
type Severity = NonNullable<AlertEnumsQuery['enums']['AlertInfoSeverity']>[number];
type Certainty = NonNullable<AlertEnumsQuery['enums']['AlertInfoCertainty']>[number];
type Category = NonNullable<AlertEnumsQuery['enums']['AlertInfoCategory']>[number];
type PartialFormFields = PartialForm<AlertInfoFilter>;

type AlertType = NonNullable<NonNullable<NonNullable<AlertInformationsQuery['public']>['alerts']>['items']>[number];
type Admin1 = AlertType['admin1s'][number];

const adminKeySelector = (admin1: AdminOption) => admin1.id;
const urgencyKeySelector = (urgency: Urgency) => urgency.key;
const severityKeySelector = (severity: Severity) => severity.key;
const certaintyKeySelector = (certainty: Certainty) => certainty.key;
const labelSelector = (alert: AlertFilters) => alert.label;
const categoryKeySelector = (category: Category) => category.key;

const alertKeySelector = (item: AlertType) => item.id;
const PAGE_SIZE = 20;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    const {
        sortState,
        limit,
        page,
        rawFilter,
        setPage,
        filter,
        setFilterField,
        filtered,
        offset,
    } = useFilterState<AlertFilter>({
        pageSize: PAGE_SIZE,
        filter: {},
    });

    const variables = useMemo<{ filters: AlertFilter, pagination: OffsetPaginationInput }>(() => ({
        pagination: {
            offset,
            limit,
        },
        filters: {
            DISTINCT: true,
            infos: {
                urgency: filter.infos?.urgency,
                severity: filter.infos?.severity,
                certainty: filter.infos?.certainty,
                category: filter.infos?.category,
            },
            country: isDefined(filter.country?.pk) ? { pk: filter.country.pk } : undefined,
            admin1: filter.admin1,
            sent: isDefined(filter.sent) ? {
                range: {
                    end: filter.sent?.range?.end,
                    start: filter.sent?.range?.start,
                },
            } : undefined,
        },
    }), [
        limit,
        offset,
        filter,
    ]);

    const {
        loading: historicalAlertsLoading,
        previousData,
        data: historicalAlertInfosResponse = previousData,
        error: historicalAlertError,
    } = useQuery<AlertInformationsQuery, AlertInformationsQueryVariables>(
        HISTORICAL_ALERTS,
        {
            skip: isNotDefined(variables),
            variables,
        },
    );

    const {
        data: alertEnumsResponse,
    } = useQuery<AlertEnumsAndAllCountryListQuery, AlertEnumsAndAllCountryListQueryVariables>(
        ALERT_ENUMS_AND_ALL_COUNTRY,
    );

    const adminQueryVariables = useMemo<FilteredAdminListQueryVariables>(
        () => {
            if (isNotDefined(filter.country)) {
                return {
                    filters: undefined,
                    // FIXME: Implement search select input
                    pagination: {
                        offset: 0,
                        limit: 500,
                    },
                };
            }

            return {
                filters: {
                    country: { pk: filter.country.pk },
                },
                // FIXME: Implement search select input
                pagination: {
                    offset: 0,
                    limit: 500,
                },
            };
        },
        [filter.country],
    );

    const {
        data: adminResponse,
    } = useQuery<FilteredAdminListQuery, FilteredAdminListQueryVariables>(
        ADMIN_LIST,
        { variables: adminQueryVariables, skip: isNotDefined(filter.country) },
    );

    const data = historicalAlertInfosResponse?.public.alerts;

    const columns = useMemo(
        () => ([
            createStringColumn<AlertType, string>(
                'event',
                strings.historicalAlertTableEventTitle,
                (item) => item.info?.event,
                { columnClassName: styles.event },
            ),
            createStringColumn<AlertType, string>(
                'category',
                strings.historicalAlertTableCategoryTitle,
                (item) => item.info?.categoryDisplay,
                { columnClassName: styles.category },
            ),
            createStringColumn<AlertType, string>(
                'region',
                strings.historicalAlertTableRegionTitle,
                (item) => (item.country.region.name),
                { columnClassName: styles.region },

            ),
            createStringColumn<AlertType, string>(
                'country',
                strings.historicalAlertTableCountryTitle,
                (item) => (item.country.name),
                { columnClassName: styles.country },
            ),
            createListDisplayColumn<AlertType, string, Admin1, HTMLProps<HTMLSpanElement>>(
                'admin1s',
                strings.historicalAlertTableAdminsTitle,
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
                strings.historicalAlertTableSentLabel,
                DateOutput,
                (_, item) => ({
                    value: item.sent,
                    format: DATE_FORMAT,
                }),
                {
                    sortable: true,
                    columnClassName: styles.sent,
                },
            ),
            createElementColumn<AlertType, string, AlertActionsProps>(
                'actions',
                strings.historicalAlertTableActionsTitle,
                AlertActions,
                (_, item) => ({ data: item }),
                {
                    columnClassName: styles.actions,
                    cellRendererClassName: styles.actions,
                },
            ),
        ]),
        [
            strings.historicalAlertTableEventTitle,
            strings.historicalAlertTableCategoryTitle,
            strings.historicalAlertTableRegionTitle,
            strings.historicalAlertTableCountryTitle,
            strings.historicalAlertTableAdminsTitle,
            strings.historicalAlertTableSentLabel,
            strings.historicalAlertTableActionsTitle,
        ],
    );
    const heading = resolveToString(
        strings.allOngoingAlertTitle,
        { numAppeals: data?.count ?? '--' },
    );

    const handleCountryFilterChange = useCallback((countryId: string | undefined) => {
        setFilterField(countryId ? { pk: countryId } : undefined, 'country');
    }, [setFilterField]);

    const setFieldValue = useFormObject<'infos', NonNullable<PartialFormFields>>(
        'infos' as const,
        setFilterField,
        {},
    );
    return (
        <Page
            className={styles.historicalAlerts}
            title={strings.historicalAlertTitle}
            heading={strings.historicalAlert}
            description={strings.historicalAlertDescription}
        >
            <Container
                className={styles.alertsTable}
                heading={heading}
                withHeaderBorder
                withGridViewInFilter
                actions={(
                    <Link
                        className={styles.sources}
                        to="allSourcesFeeds"
                        actions={(
                            <ChevronRightLineIcon className={styles.icon} />
                        )}
                    >
                        {strings.tableViewAllSources}
                    </Link>
                )}
                overlayPending
                pending={historicalAlertsLoading}
                errored={isDefined(historicalAlertError)}
                errorMessage={historicalAlertError?.message}
                footerActions={isDefined(data) && (
                    <Pager
                        activePage={page}
                        itemsCount={data?.count}
                        maxItemsPerPage={limit}
                        onActivePageChange={setPage}
                    />
                )}
                filters={(
                    <>
                        <MultiSelectInput
                            label={strings.filterUrgencyLabel}
                            placeholder={strings.filterUrgencyPlaceholder}
                            name="urgency"
                            options={alertEnumsResponse?.enums.AlertInfoUrgency}
                            keySelector={urgencyKeySelector}
                            labelSelector={labelSelector}
                            value={rawFilter.infos?.urgency}
                            onChange={setFieldValue}
                        />
                        <MultiSelectInput
                            label={strings.filterSeverityLabel}
                            placeholder={strings.filterSeverityPlaceholder}
                            name="severity"
                            options={alertEnumsResponse?.enums.AlertInfoSeverity}
                            keySelector={severityKeySelector}
                            labelSelector={labelSelector}
                            value={rawFilter.infos?.severity}
                            onChange={setFieldValue}
                        />
                        <MultiSelectInput
                            label={strings.filterCertaintyLabel}
                            placeholder={strings.filterCertaintyPlaceholder}
                            name="certainty"
                            options={alertEnumsResponse?.enums.AlertInfoCertainty}
                            keySelector={certaintyKeySelector}
                            labelSelector={labelSelector}
                            value={rawFilter.infos?.certainty}
                            onChange={setFieldValue}
                        />
                        <MultiSelectInput
                            label={strings.filterCategoriesLabel}
                            placeholder={strings.filterCategoriesPlaceholder}
                            name="category"
                            options={alertEnumsResponse?.enums.AlertInfoCategory}
                            keySelector={categoryKeySelector}
                            labelSelector={labelSelector}
                            value={rawFilter.infos?.category}
                            onChange={setFieldValue}
                        />
                        {/* // TODO Add start date and end date filter */}
                        <DateInput
                            name="sentStart"
                            label={strings.filterStartDateFrom}
                            value={filter.sent?.range?.start}
                            onChange={() => {}}
                        />
                        <DateInput
                            name="sentEnd"
                            label={strings.filterStartDateTo}
                            value={filter.sent?.range?.end}
                            onChange={() => {}}
                        />
                        <SelectInput
                            label={strings.filterCountriesLabel}
                            placeholder={strings.filterCountriesPlaceholder}
                            name="country"
                            options={alertEnumsResponse?.public.allCountries}
                            keySelector={stringIdSelector}
                            labelSelector={stringNameSelector}
                            value={rawFilter.country?.pk}
                            onChange={handleCountryFilterChange}
                        />
                        <SelectInput
                            label={strings.filterAdmin1Label}
                            placeholder={strings.filterAdmin1Placeholder}
                            name="admin1"
                            disabled={isNotDefined(filter.country)}
                            options={adminResponse?.public.admin1s.items}
                            keySelector={adminKeySelector}
                            labelSelector={stringNameSelector}
                            value={rawFilter.admin1}
                            onChange={setFilterField}
                        />
                    </>
                )}
            >
                <SortContext.Provider value={sortState}>
                    <Table
                        pending={historicalAlertsLoading}
                        filtered={filtered}
                        errored={isDefined(historicalAlertError)}
                        columns={columns}
                        keySelector={alertKeySelector}
                        data={data?.items}
                    />
                </SortContext.Provider>
            </Container>
        </Page>
    );
}

Component.displayName = 'HistoricalAlerts';
