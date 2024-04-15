import {
    useMemo,
    useState,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Page from '#components/Page';
import {
    AlertEnumsQuery,
    AlertEnumsQueryVariables,
    CountryListQuery,
    CountryListQueryVariables,
} from '#generated/types/graphql';
import useInputState from '#hooks/useInputState';

import AlertsTable from './AlertsTable';
import AlertsView from './AlertsView';
import Filters, { FilterValue } from './Filters';

import i18n from './i18n.json';
import styles from './styles.module.css';

const ALERT_ENUMS = gql`
query AlertEnums {
    enums {
      AlertInfoCertainty {
        key
        label
      }
      AlertInfoUrgency {
        label
        key
      }
      AlertInfoSeverity {
        key
        label
      }
    }
}`;

// NOTE: alertFilters is related with filteredAlertCount
const COUNTRIES_LIST = gql`
query CountryList {
  public {
    allCountries(alertFilters: {}) {
      name
      id
      iso3
      filteredAlertCount
    }
  }
}
`;

const defaultFilterValue: FilterValue = {
    countries: [],
    urgencyList: [],
    severityList: [],
    certaintyList: [],
};

export type TabKeys = 'map' | 'table';
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);
    const [activeTab, setActiveTab] = useState<TabKeys>('map');
    const [filters, setFilters] = useInputState<FilterValue>(defaultFilterValue);

    const {
        data: alertEnumsResponse,
    } = useQuery<AlertEnumsQuery, AlertEnumsQueryVariables>(
        ALERT_ENUMS,
    );

    const {
        data: countryResponse,
    } = useQuery<CountryListQuery, CountryListQueryVariables>(
        COUNTRIES_LIST,
    );

    const countriesWithAlert = useMemo(() => countryResponse?.public.allCountries.filter(
        (country) => (country?.filteredAlertCount ?? 0) > 0,
    ), [countryResponse?.public.allCountries]);

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
                <Filters
                    countries={countriesWithAlert}
                    value={filters}
                    onChange={setFilters}
                    urgencyList={alertEnumsResponse?.enums?.AlertInfoUrgency}
                    severityList={alertEnumsResponse?.enums?.AlertInfoSeverity}
                    certaintyList={alertEnumsResponse?.enums?.AlertInfoCertainty}
                />
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
