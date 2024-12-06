import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    gql,
    useMutation,
    useQuery,
} from '@apollo/client';
import { AddLineIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
    Pager,
    RawList,
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';
import {
    useBooleanState,
    useTranslation,
} from '@ifrc-go/ui/hooks';
import { isDefined } from '@togglecorp/fujs';

import Page from '#components/Page';
import {
    AlertFilter,
    AlertSubscriptionsQuery,
    AlertSubscriptionsQueryVariables,
    ArchiveUnArchiveSubscriptionMutation,
    ArchiveUnArchiveSubscriptionMutationVariables,
    DeleteSubscriptionMutation,
    DeleteSubscriptionMutationVariables,
    OffsetPaginationInput,
    UserAlertSubscriptionFilter,
    UserAlertSubscriptionType,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import useFilterState from '#hooks/useFilterState';

import NewSubscriptionModal from '../NewSubscriptionModal';
import ActiveTableActions from './ActiveTableActions';
import ArchiveTableActions from './ArchiveTableActions';
import SubscriptionTableItem from './SubscriptionTableItem';

import i18n from './i18n.json';
import styles from './styles.module.css';

const ALERT_SUBSCRIPTIONS = gql`
    query AlertSubscriptions(
        $pagination: OffsetPaginationInput,
        $filters: UserAlertSubscriptionFilter,
    ) {
        private {
            id
            userAlertSubscriptions(pagination: $pagination, filters: $filters) {
                count
                limit
                offset
                items {
                    id
                    name
                    isActive
                    notifyByEmail
                    emailFrequency
                    emailFrequencyDisplay
                    totalAlertsCount
                    filterAlertAdmin1s
                    filterAlertAdmin1sDisplay {
                        id
                        name
                    }
                    filterAlertCategoriesDisplay
                    filterAlertCategories
                    filterAlertCertaintiesDisplay
                    filterAlertCertainties
                    filterAlertCountryId
                    filterAlertCountry {
                        id
                        name
                    }
                    filterAlertSeveritiesDisplay
                    filterAlertUrgenciesDisplay
                    filterAlertUrgencies
                    filterAlertSeverities
                }
            }
        }
    }
`;

const DELETE_SUBSCRIPTION = gql`
    mutation DeleteSubscription(
        $subscriptionId: ID!,
    ) {
        private {
            deleteUserAlertSubscription(id: $subscriptionId) {
                ok
                errors
            }
            id
        }
    }
`;

const UPDATE_SUBSCRIPTION = gql`
    mutation ArchiveUnArchiveSubscription(
        $subscriptionId: ID!,
        $data: UserAlertSubscriptionInput!,
    ) {
        private {
            updateUserAlertSubscription(
                id: $subscriptionId,
                data: $data,
            ) {
                errors
                ok
                result {
                    id
                    name
                    isActive
                }
            }
        }
    }
`;

const PAGE_SIZE = 10;

const subscriptionKeySelector = (subscription: UserAlertSubscriptionType) => subscription.id;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    const alert = useAlert();

    type TabKey = 'active' | 'archive';
    const [activeTab, setActiveTab] = useState<TabKey>('active');

    const [
        selectedSubscription,
        setSelectedSubscription,
    ] = useState<string | undefined>();

    const [showSubscriptionModal, {
        setTrue: setShowSubscriptionModalTrue,
        setFalse: setShowSubscriptionModalFalse,
    }] = useBooleanState(false);

    const {
        page,
        setPage,
        limit,
        offset,
    } = useFilterState<AlertFilter>({
        pageSize: PAGE_SIZE,
        filter: {},
    });

    const variables = useMemo<{
        pagination: OffsetPaginationInput,
        filters: UserAlertSubscriptionFilter,
    }>(() => ({
        pagination: {
            offset,
            limit,
        },
        filters: {
            isActive: {
                exact: activeTab === 'active',
            },
        },
    }), [
        activeTab,
        limit,
        offset,
    ]);

    const {
        previousData,
        data: alertSubscriptions = previousData,
        loading: alertSubscriptionLoading,
        error: alertSubscriptionError,
        refetch,
    } = useQuery<AlertSubscriptionsQuery, AlertSubscriptionsQueryVariables>(
        ALERT_SUBSCRIPTIONS,
        {
            variables,
        },
    );

    const data = alertSubscriptions?.private.userAlertSubscriptions;

    const [
        triggerSubscriptionUpdate,
    ] = useMutation<
        ArchiveUnArchiveSubscriptionMutation,
        ArchiveUnArchiveSubscriptionMutationVariables
    >(
        UPDATE_SUBSCRIPTION,
        {
            onCompleted: (projectResponse) => {
                const response = projectResponse?.private?.updateUserAlertSubscription;
                if (!response) {
                    return;
                }
                if (response.ok) {
                    if (response.result) {
                        alert.show(
                            strings.subscriptionUnarchived,
                            { variant: 'success' },
                        );
                    } else {
                        alert.show(
                            strings.subscriptionArchived,
                            { variant: 'success' },
                        );
                        refetch();
                    }
                } else {
                    alert.show(
                        strings.subscriptionFailedToUpdate,
                        { variant: 'danger' },
                    );
                }
            },
            onError: () => {
                alert.show(
                    strings.subscriptionFailedToUpdate,
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleEditSubscription = useCallback((key: string) => {
        setSelectedSubscription(key);
        setShowSubscriptionModalTrue();
    }, [
        setShowSubscriptionModalTrue,
    ]);

    const [
        triggerSubscriptionDelete,
    ] = useMutation<DeleteSubscriptionMutation, DeleteSubscriptionMutationVariables>(
        DELETE_SUBSCRIPTION,
        {
            onCompleted: (deleteResponse) => {
                const response = deleteResponse?.private?.deleteUserAlertSubscription;
                if (!response) {
                    return;
                }
                if (response.ok) {
                    alert.show(
                        strings.subscriptionDeleted,
                        { variant: 'success' },
                    );
                } else {
                    alert.show(
                        strings.subscriptionFailedToDelete,
                        { variant: 'danger' },
                    );
                }
            },
            onError: () => {
                alert.show(
                    strings.subscriptionFailedToDelete,
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleDeleteSubscription = useCallback((id: string) => {
        triggerSubscriptionDelete({
            variables: {
                subscriptionId: id,
            },
        }).then(() => {
            refetch();
        });
    }, [
        triggerSubscriptionDelete,
        refetch,
    ]);

    const handleTab = useCallback((newTab: TabKey) => {
        setActiveTab(newTab);
        setPage(1);
    }, [
        setPage,
    ]);

    const handleArchiveUnarchive = useCallback((id: string, archive: boolean) => {
        const selectedSubscriptionDetails = data?.items.find(
            (sub) => sub.id === id,
        );

        triggerSubscriptionUpdate({
            variables: {
                subscriptionId: id,
                data: {
                    isActive: archive,
                    filterAlertAdmin1s: selectedSubscriptionDetails?.filterAlertAdmin1s ?? [],
                    filterAlertCountry: selectedSubscriptionDetails?.filterAlertCountryId ?? '',
                    name: selectedSubscriptionDetails?.name ?? '',
                },
            },
        }).then(() => {
            refetch();
        });
    }, [
        data?.items,
        triggerSubscriptionUpdate,
        refetch,
    ]);

    const activeRendererParams = useCallback((
        key: string,
        value: UserAlertSubscriptionType,
    ) => ({
        id: value.id,
        name: value.name,
        alertCount: value.totalAlertsCount ?? 0,
        filterAlertUrgencies: value?.filterAlertUrgenciesDisplay,
        filterAlertCertainties: value?.filterAlertCertaintiesDisplay,
        filterAlertSeverities: value?.filterAlertSeveritiesDisplay,
        filterAlertCategories: value?.filterAlertCategoriesDisplay,
        filterAlertCountry: value?.filterAlertCountry.name,
        filterAlertAdmin1s: value?.filterAlertAdmin1sDisplay?.map(
            (admin) => admin.name,
        ),
        isActive: value?.isActive,
        actions: <ActiveTableActions
            onArchiveClick={() => handleArchiveUnarchive(value.id, false)}
            onEditClick={() => handleEditSubscription(key)}
            onSubscriptionRemove={() => handleDeleteSubscription(value.id)}
        />,
    }), [
        handleDeleteSubscription,
        handleArchiveUnarchive,
        handleEditSubscription,
    ]);

    const archiveRendererParams = useCallback((_: string, value: UserAlertSubscriptionType) => ({
        id: value.id,
        name: value.name,
        alertCount: value.totalAlertsCount ?? 0,
        filterAlertUrgencies: value?.filterAlertUrgenciesDisplay,
        filterAlertCertainties: value?.filterAlertCertaintiesDisplay,
        filterAlertSeverities: value?.filterAlertSeveritiesDisplay,
        filterAlertCategories: value?.filterAlertCategoriesDisplay,
        filterAlertCountry: value?.filterAlertCountry.name,
        filterAlertAdmin1s: value?.filterAlertAdmin1sDisplay?.map(
            (admin) => admin.name,
        ),
        isActive: value?.isActive,
        actions: <ArchiveTableActions
            onUnArchive={() => handleArchiveUnarchive(value.id, true)}
            onSubscriptionRemove={() => handleDeleteSubscription(value.id)}
        />,
    }), [
        handleDeleteSubscription,
        handleArchiveUnarchive,
    ]);

    const selectedSubscriptionDetails = useMemo(() => {
        const item = data?.items.find((sub) => sub.id === selectedSubscription);
        if (!item) {
            return undefined;
        }
        return ({
            ...item,
            filterAlertCountry: item.filterAlertCountryId,
        });
    }, [
        data,
        selectedSubscription,
    ]);

    const handleShowNewSubscriptionModal = useCallback(() => {
        setSelectedSubscription(undefined);
        setShowSubscriptionModalTrue();
    }, [
        setSelectedSubscription,
        setShowSubscriptionModalTrue,
    ]);

    return (
        <Page
            title={strings.mySubscription}
            className={styles.mySubscription}
            heading={strings.mySubscription}
            description={strings.subscriptionDescription}
        >
            <Container
                contentViewType="vertical"
                spacing="comfortable"
                actions={(
                    <Button
                        className={styles.sources}
                        onClick={handleShowNewSubscriptionModal}
                        name={undefined}
                        variant="tertiary"
                        actions={(
                            <AddLineIcon
                                className={styles.icon}
                            />
                        )}
                    >
                        {strings.myNewSubscription}
                    </Button>
                )}
                footerActions={isDefined(data) && (
                    <Pager
                        activePage={page}
                        itemsCount={data?.count ?? 0}
                        maxItemsPerPage={limit}
                        onActivePageChange={setPage}
                    />
                )}
                pending={alertSubscriptionLoading}
                errored={isDefined(alertSubscriptionError)}
                overlayPending
            >
                {showSubscriptionModal && (
                    <NewSubscriptionModal
                        subscription={selectedSubscriptionDetails}
                        onCloseModal={setShowSubscriptionModalFalse}
                        onSuccess={refetch}
                    />
                )}
                <Tabs
                    value={activeTab}
                    onChange={handleTab}
                    variant="primary"
                >
                    <TabList>
                        <Tab name="active">
                            {strings.activeSubscriptionsTab}
                        </Tab>
                        <Tab name="archive">
                            {strings.archivedSubscriptionTab}
                        </Tab>
                    </TabList>
                    <TabPanel
                        name="active"
                        className={styles.tabPanel}
                    >
                        <Container
                            empty={data?.items.length === 0}
                            emptyMessage={strings.subscriptionEmptyMessage}
                        />
                        <RawList
                            data={data?.items}
                            renderer={SubscriptionTableItem}
                            rendererParams={activeRendererParams}
                            keySelector={subscriptionKeySelector}
                        />
                    </TabPanel>
                    <TabPanel
                        name="archive"
                        className={styles.tabPanel}
                    >
                        <Container
                            empty={data?.items.length === 0}
                            emptyMessage={strings.subscriptionEmptyMessage}
                        />
                        <RawList
                            data={data?.items}
                            renderer={SubscriptionTableItem}
                            rendererParams={archiveRendererParams}
                            keySelector={subscriptionKeySelector}
                        />
                    </TabPanel>
                </Tabs>
            </Container>
        </Page>
    );
}
Component.displayName = 'MySubscriptions';
