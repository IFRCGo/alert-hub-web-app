import {
    useCallback,
    useMemo,
} from 'react';
import { useParams } from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    Chip,
    Container,
    DateInput,
    List,
    Pager,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import Page from '#components/Page';
import {
    AlertFilter,
    DetailsOfSubsQuery,
    DetailsOfSubsQueryVariables,
    UserAlertSubscriptionType,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';
import { stringIdSelector } from '#utils/selectors';

import AlertInfoItem from './AlertInfoItem';

import i18n from './i18n.json';
import styles from './styles.module.css';

const PAGE_SIZE = 20;

const SUBSCRIPTION_ALERT_LIST = gql`
    query DetailsOfSubs(
        $pk: ID!,
        $pagination: OffsetPaginationInput,
        $filters: AlertFilter,
    ) {
        private {
            userAlertSubscription(pk: $pk) {
                alerts (
                    pagination: $pagination,
                    filters: $filters,
                ){
                    items {
                        id
                        info {
                            event
                            id
                            description
                        }
                    }
                    count
                }
                filterAlertUrgenciesDisplay
                id
                name
                filterAlertUrgencies
                filterAlertSeveritiesDisplay
                filterAlertSeverities
                filterAlertCountry {
                    id
                    name
                }
                filterAlertCountryId
                filterAlertCertaintiesDisplay
                filterAlertCertainties
                filterAlertCategoriesDisplay
                filterAlertCategories
                filterAlertAdmin1sDisplay {
                    id
                    name
                }
                filterAlertAdmin1s
            }
        }
    }
`;

type AlertInfo = NonNullable<NonNullable<UserAlertSubscriptionType>['alerts']>['items'][number];

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { subscriptionId } = useParams();

    const strings = useTranslation(i18n);

    const {
        limit,
        page,
        setPage,
        setFilterField,
        offset,
        filter,
    } = useFilterState<{
        startDateAfter?: string,
        startDateBefore?: string,
    }>({
        pageSize: PAGE_SIZE,
        filter: {},
    });

    const variables = useMemo<DetailsOfSubsQueryVariables>(() => {
        if (!subscriptionId) {
            return {} as DetailsOfSubsQueryVariables;
        }

        const filters: AlertFilter = {
            sent: {
                range: {
                    start: filter.startDateAfter,
                    end: filter.startDateBefore,
                },
            },
        };

        const finalFilters = (isDefined(filter.startDateAfter)
            || isDefined(filter.startDateBefore)
        ) ? filters : {};

        return {
            pk: subscriptionId,
            pagination: {
                offset,
                limit,
            },
            filters: finalFilters,
        };
    }, [
        subscriptionId,
        limit,
        offset,
        filter,
    ]);

    const {
        previousData,
        loading: alertLoading,
        error: alertError,
        data: alertSubscription = previousData,
    } = useQuery<DetailsOfSubsQuery, DetailsOfSubsQueryVariables>(
        SUBSCRIPTION_ALERT_LIST,
        {
            skip: isNotDefined(variables),
            variables,
        },
    );

    const alertsData = alertSubscription?.private?.userAlertSubscription;

    const rendererParams = useCallback((_: string, value: AlertInfo) => ({
        alertId: value.id,
        alertTitle: value.info?.event,
        alertDescription: value.info?.description ?? undefined,
    }), []);

    return (
        <Page
            className={styles.subscriptionDetail}
            title={strings.subscriptionDetailTitle}
            heading={alertSubscription?.private?.userAlertSubscription?.name}
        >
            <Container
                childrenContainerClassName={styles.alertFilters}
                filters={(
                    <>
                        <DateInput
                            name="startDateAfter"
                            label={strings.filterStartDateFrom}
                            onChange={setFilterField}
                            value={filter.startDateAfter}
                        />
                        <DateInput
                            name="startDateBefore"
                            label={strings.filterStartDateTo}
                            onChange={setFilterField}
                            value={filter.startDateBefore}
                        />
                    </>
                )}
                footerActions={(
                    <Pager
                        activePage={page}
                        itemsCount={alertsData?.alerts.count ?? 0}
                        maxItemsPerPage={PAGE_SIZE}
                        onActivePageChange={setPage}
                    />
                )}
            >
                <div className={styles.filters}>
                    {isDefined(alertsData?.filterAlertCountry) && (
                        <Chip
                            name="country"
                            label={alertsData.filterAlertCountry.name}
                            variant="tertiary"
                        />
                    )}
                    {isDefined(alertsData?.filterAlertAdmin1sDisplay)
                        && alertsData.filterAlertAdmin1sDisplay?.map((admin) => (
                            <Chip
                                name="admin1"
                                label={admin.name}
                                variant="tertiary"
                            />
                        ))}
                    {isDefined(alertsData?.filterAlertUrgenciesDisplay)
                        && alertsData.filterAlertUrgenciesDisplay?.map((urgency) => (
                            <Chip
                                name="urgencies"
                                label={urgency}
                                variant="tertiary"
                            />
                        ))}
                    {isDefined(alertsData?.filterAlertCertaintiesDisplay)
                        && alertsData.filterAlertCertaintiesDisplay?.map((certainty) => (
                            <Chip
                                name="certainties"
                                label={certainty}
                                variant="tertiary"
                            />
                        ))}
                    {isDefined(alertsData?.filterAlertCategoriesDisplay)
                        && alertsData.filterAlertCategoriesDisplay?.map((category) => (
                            <Chip
                                name="categories"
                                label={category}
                                variant="tertiary"
                            />
                        ))}
                    {isDefined(alertsData?.filterAlertSeveritiesDisplay)
                        && alertsData.filterAlertSeveritiesDisplay?.map((severity) => (
                            <Chip
                                name="severity"
                                label={severity}
                                variant="tertiary"
                            />
                        ))}
                </div>
                <List
                    className={styles.alertItem}
                    data={alertsData?.alerts.items}
                    renderer={AlertInfoItem}
                    rendererParams={rendererParams}
                    keySelector={stringIdSelector}
                    pending={alertLoading}
                    errored={isDefined(alertError)}
                    filtered={false}
                    emptyMessage={strings.filterEmptyMessage}
                />
            </Container>
        </Page>
    );
}

Component.displayName = 'SubscriptionDetail';
