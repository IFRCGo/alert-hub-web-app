import { useState } from 'react';
import {
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Page from '#components/Page';

import AlertsTable from './AlertsTable';
import AlertsView from './AlertsView';

import i18n from './i18n.json';
import styles from './styles.module.css';

export type TabKeys = 'map' | 'table';
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);
    const [activeTab, setActiveTab] = useState<TabKeys>('map');

    return (
        <Tabs
            value={activeTab}
            onChange={setActiveTab}
            variant="secondary"
        >
            <Page
                title={strings.homeTitle}
                className={styles.home}
                heading={strings.homeHeading}
                description={strings.homeDescription}
                infoContainerClassName={styles.tabSection}
                mainSectionClassName={styles.content}
                info={(
                    <TabList>
                        <Tab name="map">
                            { strings.mapTabTitle }
                        </Tab>
                        <Tab name="table">
                            { strings.tableTabTitle }
                        </Tab>
                    </TabList>
                )}
            >
                <TabPanel name="map">
                    <AlertsView />
                </TabPanel>
                <TabPanel name="table">
                    <AlertsTable />
                </TabPanel>
            </Page>
        </Tabs>
    );
}

Component.displayName = 'Home';
