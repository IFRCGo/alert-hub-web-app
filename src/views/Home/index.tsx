import {
    useCallback,
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
import { isNotDefined } from '@togglecorp/fujs';

import Page from '#components/Page';
import {
    AlertEnumsQuery,
    AlertEnumsQueryVariables,
    AlertInfoCertaintyEnum,
    AlertInfoSeverityEnum,
    AlertInfoUrgencyEnum,
    CountryListQuery,
    CountryListQueryVariables,
    FilteredAdminListQuery,
    FilteredAdminListQueryVariables,
} from '#generated/types/graphql';

import AlertContext, { AlertContextProps } from './AlertContext';
import AlertsTable from './AlertsTable';
import AlertsView from './AlertsView';
import Filters from './Filters';

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
query CountryList($alertFilters: AlertFilter) {
  public {
    id
    allCountries(alertFilters: $alertFilters) {
      name
      id
      iso3
      filteredAlertCount
      ifrcGoId
    }
  }
}
`;

// TODO: filter this by selected country
const ADMIN_LIST = gql`
query FilteredAdminList {
    public {
        id
      admin1s(filters: {}) {
        items {
          id
          name
          countryId
        }
      }
    }
  }
`;

type CountryOption = NonNullable<NonNullable<CountryListQuery['public']>['allCountries']>[number];

export type TabKeys = 'map' | 'table';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);
    const [activeTab, setActiveTab] = useState<TabKeys>('map');

    const [activeCountryId, setActiveCountryId] = useState<string | undefined>(undefined);
    const [activeGoCountryId, setActiveGoCountryId] = useState<string | undefined>(undefined);
    const [activeAlertId, setActiveAlertId] = useState<string | undefined>(undefined);
    const [activeAdmin1Id, setActiveAdmin1Id] = useState<string | undefined>(undefined);
    const [activeGoAdmin1Id, setActiveGoAdmin1Id] = useState<string | undefined>(undefined);
    const [bbox, setBbox] = useState<unknown | undefined>();
    const [activeCountryName, setActiveCountryName] = useState<string | undefined>();
    const [
        selectedUrgencyTypes,
        setSelectedUrgencyTypes,
    ] = useState<AlertInfoUrgencyEnum[] | undefined>();
    const [
        selectedSeverityTypes,
        setSelectedSeverityTypes,
    ] = useState<AlertInfoSeverityEnum[] | undefined>();
    const [
        selectedCertaintyTypes,
        setSelectedCertaintyTypes,
    ] = useState<AlertInfoCertaintyEnum[] | undefined>();

    const {
        data: alertEnumsResponse,
    } = useQuery<AlertEnumsQuery, AlertEnumsQueryVariables>(
        ALERT_ENUMS,
    );

    const {
        data: countryResponse,
    } = useQuery<CountryListQuery, CountryListQueryVariables>(
        COUNTRIES_LIST,
        { variables: { alertFilters: {} } },
    );

    const {
        data: adminResponse,
    } = useQuery<FilteredAdminListQuery, FilteredAdminListQueryVariables>(
        ADMIN_LIST,
    );

    const countriesWithAlert = useMemo(() => countryResponse?.public.allCountries.filter(
        (country: CountryOption) => (country?.filteredAlertCount ?? 0) > 0,
    ), [countryResponse]);

    const setActiveCountryIdSafe = useCallback(
        (countryId: string | undefined) => {
            setActiveCountryId(countryId);
            setActiveCountryName(undefined);
            setActiveAlertId(undefined);
            setActiveAdmin1Id(undefined);
            setActiveGoAdmin1Id(undefined);
            setActiveGoCountryId(undefined);
            if (isNotDefined(countryId)) {
                setBbox(undefined);
            }
        },
        [],
    );

    const alertContextValue = useMemo<AlertContextProps>(
        () => ({
            bbox,
            setBbox,
            activeAlertId,
            activeCountryId,
            activeCountryName,
            activeAdmin1Id,
            activeGoAdmin1Id,
            activeGoCountryId,
            selectedUrgencyTypes,
            selectedSeverityTypes,
            selectedCertaintyTypes,
            setActiveAlertId,
            setActiveGoCountryId,
            setActiveGoAdmin1Id,
            setActiveCountryId: setActiveCountryIdSafe,
            setActiveAdmin1Id,
            setActiveCountryName,
            setSelectedCertaintyTypes,
            setSelectedUrgencyTypes,
            setSelectedSeverityTypes,
        }),
        [
            bbox,
            activeCountryName,
            activeAlertId,
            activeGoCountryId,
            activeGoAdmin1Id,
            activeAdmin1Id,
            activeCountryId,
            selectedCertaintyTypes,
            selectedUrgencyTypes,
            selectedSeverityTypes,
            setActiveCountryIdSafe,
        ],
    );

    return (
        <Tabs
            value={activeTab}
            onChange={setActiveTab}
            variant="secondary"
        >
            <AlertContext.Provider value={alertContextValue}>
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
                                {strings.mapTabTitle}
                            </Tab>
                            <Tab name="table">
                                {strings.tableTabTitle}
                            </Tab>
                        </TabList>
                    )}
                >
                    <Filters
                        countryList={countriesWithAlert}
                        admin1List={adminResponse?.public?.admin1s?.items}
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
            </AlertContext.Provider>
        </Tabs>
    );
}

Component.displayName = 'Home';
