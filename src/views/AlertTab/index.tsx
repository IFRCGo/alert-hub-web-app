import {
    useCallback,
    useState,
} from 'react';
import {
    Tab,
    TabList,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import i18n from './i18n.json';
import styles from './styles.module.css';

type TabKeys = 'map' | 'table';

export function AlertTab() {
    const strings = useTranslation(i18n);
    const [activeTab, setActiveTab] = useState<TabKeys>('map');

    const handleTabChange = useCallback((newTab: TabKeys) => {
        setActiveTab(newTab);
    }, []);

    return (
        <TabList className={styles.tabList}>
            <Tab
                value={activeTab}
                name="map"
                onChange={() => handleTabChange('map')}
            >
                {strings.ongoingAlertMapTabTitle}
            </Tab>
            <Tab
                value={activeTab}
                name="table"
                onChange={() => handleTabChange('table')}
            >
                {strings.ongoingAlertTableTabTitle}
            </Tab>
        </TabList>
    );
}
export default AlertTab;
