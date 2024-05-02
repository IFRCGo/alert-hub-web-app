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
    AlertInfoCategoryEnum,
    AlertInfoCertaintyEnum,
    AlertInfoSeverityEnum,
    AlertInfoUrgencyEnum,
    AllCountryListQuery,
    AllCountryListQueryVariables,
    FilteredAdminListQuery,
    FilteredAdminListQueryVariables,
    RegionListQuery,
    RegionListQueryVariables,
} from '#generated/types/graphql';

import AlertContext, { AlertContextProps } from './AlertContext';
import AlertsTable from './AlertsTable';
import AlertsView from './AlertsView';
import MapFilters from './MapFilters';
import TableFilters from './TableFilters';

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
      AlertInfoCategory {
        key
        label
      }
    }
}`;

const COUNTRIES_LIST = gql`
query AllCountryList($alertFilters: AlertFilter) {
  public {
    id
    allCountries(alertFilters: $alertFilters) {
      name
      id
      iso3
      ifrcGoId
      alertCount
    }
  }
}
`;

const ADMIN_LIST = gql`
query FilteredAdminList($filters:Admin1Filter) {
    public {
      id
      admin1s(filters: $filters) {
        items {
          id
          name
          countryId
        }
      }
    }
  }
`;

const REGION_LIST = gql`
query RegionList {
    public {
        id
      regions {
        items {
          id
          name
          ifrcGoId
        }
      }
    }
  }
`;

type CountryOption = NonNullable<NonNullable<AllCountryListQuery['public']>['allCountries']>[number];

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
    const [activeRegionId, setActiveRegionId] = useState<string | undefined>();
    const [startDateFrom, setStartDateFrom] = useState<string | undefined>();
    const [startDateTo, setStartDateTo] = useState<string | undefined>();

    const [
        selectedCategoryTypes,
        setSelectedCategoryTypes,
    ] = useState<AlertInfoCategoryEnum[] | undefined>();

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
    } = useQuery<AllCountryListQuery, AllCountryListQueryVariables>(
        COUNTRIES_LIST,
        { variables: { alertFilters: {} } },
    );

    const {
        data: regionResponse,
    } = useQuery<RegionListQuery, RegionListQueryVariables>(
        REGION_LIST,
    );

    const adminQueryVariables = useMemo<FilteredAdminListQueryVariables>(
        () => {
            if (isNotDefined(activeCountryId)) {
                return { filters: undefined };
            }

            return {
                filters: {
                    country: { pk: activeCountryId },
                },
            };
        },
        [activeCountryId],
    );

    const {
        data: adminResponse,
    } = useQuery<FilteredAdminListQuery, FilteredAdminListQueryVariables>(
        ADMIN_LIST,
        { variables: adminQueryVariables },
    );

    const countriesWithAlert = useMemo(() => countryResponse?.public.allCountries.filter(
        (country: CountryOption) => (country?.alertCount ?? 0) > 0,
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
            activeRegionId,
            activeAdmin1Id,
            activeGoAdmin1Id,
            activeGoCountryId,
            selectedUrgencyTypes,
            selectedSeverityTypes,
            selectedCertaintyTypes,
            selectedCategoryTypes,
            startDateFrom,
            startDateTo,
            setActiveAlertId,
            setActiveGoCountryId,
            setActiveGoAdmin1Id,
            setActiveCountryId: setActiveCountryIdSafe,
            setActiveAdmin1Id,
            setActiveCountryName,
            setSelectedCertaintyTypes,
            setSelectedUrgencyTypes,
            setSelectedSeverityTypes,
            setActiveRegionId,
            setSelectedCategoryTypes,
            setStartDateFrom,
            setStartDateTo,
        }),
        [
            bbox,
            activeCountryName,
            activeAlertId,
            activeRegionId,
            setActiveRegionId,
            activeGoCountryId,
            activeGoAdmin1Id,
            activeAdmin1Id,
            activeCountryId,
            selectedCertaintyTypes,
            selectedUrgencyTypes,
            selectedSeverityTypes,
            startDateFrom,
            startDateTo,
            setStartDateFrom,
            setStartDateTo,
            setActiveCountryIdSafe,
            selectedCategoryTypes,
            setSelectedCategoryTypes,
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
                    <TabPanel
                        className={styles.mapFilter}
                        name="map"
                    >
                        <MapFilters
                            countryList={countriesWithAlert}
                            admin1List={adminResponse?.public?.admin1s?.items}
                            urgencyList={alertEnumsResponse?.enums?.AlertInfoUrgency}
                            severityList={alertEnumsResponse?.enums?.AlertInfoSeverity}
                            certaintyList={alertEnumsResponse?.enums?.AlertInfoCertainty}
                        />
                        <AlertsView />
                    </TabPanel>
                    <TabPanel
                        name="table"
                        className={styles.tableFilter}
                    >
                        <TableFilters
                            countryList={countriesWithAlert}
                            regionsList={regionResponse?.public?.regions.items}
                            admin1List={adminResponse?.public?.admin1s?.items}
                            categoryList={alertEnumsResponse?.enums?.AlertInfoCategory}
                            urgencyList={alertEnumsResponse?.enums?.AlertInfoUrgency}
                            severityList={alertEnumsResponse?.enums?.AlertInfoSeverity}
                            certaintyList={alertEnumsResponse?.enums?.AlertInfoCertainty}
                        />
                        <AlertsTable />
                    </TabPanel>
                </Page>
            </AlertContext.Provider>
        </Tabs>
    );
}

Component.displayName = 'Home';
