import { useState } from 'react';
import {
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';

import { useTranslation } from '@ifrc-go/ui/hooks';

import Page from '#components/Page';

import OngoingAlertMap from '../AlertMap';
import AlertTable from '../AlertTable';

import i18n from './i18n.json';
import styles from './styles.module.css';

export type TabKeys = 'map' | 'table';
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);
    const [activeTab, setActiveTab] = useState<TabKeys>('map');

    const [activeCountryId, setActiveCountryId] = useState<string | undefined>();

    return (
        <Page
            title={strings.homeTitle}
            className={styles.home}
            heading={strings.homeHeading}
            description={strings.homeDescription}
            descriptionContainerClassName={styles.headingDescription}
            mainSectionClassName={styles.content}
        >
            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                variant="secondary"
            >
                <TabList>
                    <Tab name="map">
                        { strings.mapTabTitle }
                    </Tab>
                    <Tab name="table">
                        { strings.tableTabTitle }
                    </Tab>
                </TabList>
                <TabPanel name="map">
                    <OngoingAlertMap
                        bbox={undefined}
                    />
                </TabPanel>
                <TabPanel name="table">
                    <AlertTable />
                </TabPanel>
            </Tabs>
            <OngoingAlertMap
                bbox={undefined}
            />
            <OngoingAlertMap
                bbox={undefined}
                onActiveCountryChange={setActiveCountryId}
                activeCountryId={activeCountryId}
            />
        </Page>
    );
}

Component.displayName = 'Home';
