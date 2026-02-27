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
    ListView,
    Pager,
    TextOutput,
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
                spacing="md"
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
                footerActions={isDefined(alertsData) && (
                    <Pager
                        activePage={page}
                        itemsCount={alertsData?.alerts.count ?? 0}
                        maxItemsPerPage={PAGE_SIZE}
                        onActivePageChange={setPage}
                    />
                )}
                pending={alertLoading}
                errored={isDefined(alertError)}
                overlayPending
            >
                <ListView
                    spacing="3xs"
                >
                    <Chip
                        name={undefined}
                        variant="tertiary"
                        className={styles.filterItem}
                        label={(
                            <TextOutput
                                label={strings.subscriptionCountry}
                                value={alertsData?.filterAlertCountry.name}
                                strongLabel
                            />
                        )}
                    />
                    <Chip
                        name={undefined}
                        variant="tertiary"
                        className={styles.filterItem}
                        label={(
                            <TextOutput
                                label={strings.subscriptionAdmin1}
                                value={alertsData?.filterAlertAdmin1sDisplay?.map(
                                    (admin) => admin.name,
                                ).join(', ')}
                                strongLabel
                            />
                        )}
                    />
                    <Chip
                        name={undefined}
                        variant="tertiary"
                        className={styles.filterItem}
                        label={(
                            <TextOutput
                                label={strings.subscriptionUrgency}
                                value={alertsData?.filterAlertUrgenciesDisplay.join(', ')}
                                strongLabel
                            />
                        )}
                    />
                    <Chip
                        name={undefined}
                        variant="tertiary"
                        className={styles.filterItem}
                        label={(
                            <TextOutput
                                label={strings.subscriptionCertainty}
                                value={alertsData?.filterAlertCertaintiesDisplay.join(', ')}
                                strongLabel
                            />
                        )}
                    />
                    <Chip
                        name={undefined}
                        variant="tertiary"
                        className={styles.filterItem}
                        label={(
                            <TextOutput
                                label={strings.subscriptionCategory}
                                value={alertsData?.filterAlertCategoriesDisplay.join(', ')}
                                strongLabel
                            />
                        )}
                    />
                    <Chip
                        name={undefined}
                        variant="tertiary"
                        className={styles.filterItem}
                        label={(
                            <TextOutput
                                label={strings.subscriptionSeverity}
                                value={alertsData?.filterAlertSeveritiesDisplay.join(', ')}
                                strongLabel
                            />
                        )}
                    />
                </ListView>
                <List
                    data={alertsData?.alerts.items}
                    renderer={AlertInfoItem}
                    rendererParams={rendererParams}
                    keySelector={stringIdSelector}
                    emptyMessage={strings.susbcriptionEmptyMessage}
                    pending={false}
                    errored={false}
                    filtered={false}
                    className={styles.list}

                />
            </Container>
        </Page>
    );
}

Component.displayName = 'SubscriptionDetail';
