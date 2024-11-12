import {
    useCallback,
    useState,
} from 'react';
import { AddLineIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
    List,
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';
import {
    useBooleanState,
    useTranslation,
} from '@ifrc-go/ui/hooks';

import Page from '#components/Page';

import NewSubscriptionModal from '../NewSubscriptionModal';
import ActiveTableActions from './ActiveTableActions';
import ArchiveTableActions from './ArchiveTableActions';
import { SubscriptionDetail } from './common';
import SubscriptionTableItem from './SubscriptionTableItem';

import i18n from './i18n.json';
import styles from './styles.module.css';

const subscriptionKeySelector = (subscription: SubscriptionDetail) => subscription.id;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    const data: SubscriptionDetail[] = [
        {
            id: '1',
            country: 'USA',
            admin1: 'LA',
            title: 'Earthquake Alert',
            totalCount: 20,
            urgency: [],
            certainty: [],
            severity: [],
        },
        {
            id: '2',
            country: 'Canada',
            admin1: 'Toronto',
            title: 'Flood Alert',
            totalCount: 30,
            urgency: [],
            certainty: [],
            severity: [],
        },
    ];

    type TabKey = 'active' | 'archive';
    const [activeTab, setActiveTab] = useState<TabKey>('active');

    const [showSubscriptionModal, {
        setTrue: setShowSubscriptionModalTrue,
        setFalse: setShowSubscriptionModalFalse,
    }] = useBooleanState(false);

    const activeRendererParams = useCallback((_: string, value: SubscriptionDetail) => ({
        title: value.title,
        totalCount: value.totalCount ?? 0,
        country: value?.country,
        admin1: value?.admin1,
        urgency: value?.urgency,
        certainty: value?.certainty,
        severity: value?.severity,
        actions: <ActiveTableActions />,
    }), []);

    const archiveRendererParams = useCallback((_: string, value: SubscriptionDetail) => ({
        title: value.title,
        totalCount: value.totalCount ?? 0,
        country: value?.country,
        admin1: value?.admin1,
        urgency: value?.urgency,
        certainty: value?.certainty,
        severity: value?.severity,
        actions: <ArchiveTableActions />,
    }), []);

    return (
        <Page
            title={strings.mySubscription}
            className={styles.mySubscription}
            heading={strings.mySubscription}
            // TODO: Add subscription description
            mainSectionClassName={styles.content}
        >
            <Container
                contentViewType="vertical"
                actions={(
                    <Button
                        className={styles.sources}
                        onClick={setShowSubscriptionModalTrue}
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
            >
                {showSubscriptionModal && data?.map((subscription) => (
                    <NewSubscriptionModal
                        subscription={subscription}
                        onCloseModal={setShowSubscriptionModalFalse}
                    />
                ))}
                <Tabs
                    value={activeTab}
                    onChange={setActiveTab}
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
                        className={styles.subscriptions}
                    >
                        <List
                            className={styles.subscription}
                            data={data}
                            renderer={SubscriptionTableItem}
                            rendererParams={activeRendererParams}
                            keySelector={subscriptionKeySelector}
                            filtered={false}
                            pending={false}
                            errored={false}
                        />
                    </TabPanel>
                    <TabPanel
                        name="archive"
                        className={styles.subscriptions}
                    >
                        <List
                            className={styles.subscription}
                            data={data}
                            renderer={SubscriptionTableItem}
                            rendererParams={archiveRendererParams}
                            keySelector={subscriptionKeySelector}
                            filtered={false}
                            pending={false}
                            errored={false}
                        />
                    </TabPanel>
                </Tabs>
            </Container>
        </Page>
    );
}
Component.displayName = 'MySubscription';
