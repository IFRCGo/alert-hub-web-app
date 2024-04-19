import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { ChevronLeftLineIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
    List,
    Pager,
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    _cs,
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import {
    Admin1AlertListQuery,
    AlertInfoQuery,
    CountryAdmin1Query,
    CountryAdmin1QueryVariables,
    CountryAlertsListQuery,
    CountryListQuery,
} from '#generated/types/graphql';
import { stringIdSelector } from '#utils/selectors';

import Admin1ListItem from './Admin1ListItem';
import AlertDetail from './AlertDetail';
import AlertListItem from './AlertListItem';
import CountryListItem from './CountryListItem';

import i18n from './i18n.json';
import styles from './styles.module.css';

const COUNTRY_ADMIN1 = gql`
query CountryAdmin1($pk: ID!) {
    public {
      id
      country(pk: $pk) {
        id
        name
        alertCount
        ifrcGoId
        admin1s(alertFilters: {}) {
          id
          name
          ifrcGoId
          filteredAlertCount
        }
      }
    }
  }
`;

type Country = NonNullable<NonNullable<CountryListQuery['public']>['allCountries']>[number];

type CountryAdmin1 = NonNullable<NonNullable<CountryAdmin1Query['public']>['country']>['admin1s'][number];

type Alert = NonNullable<NonNullable<NonNullable<CountryAlertsListQuery['public']>['alerts']>['items']>[number];

type AlertInfoDetail = NonNullable<NonNullable<NonNullable<AlertInfoQuery['public']>['alert']>['info']>;

type Admin1Alerts = NonNullable<NonNullable<Admin1AlertListQuery['public']>['alerts']>['items'][number];

interface Props {
    className?: string;
    countriesWithAlert?: Country[];
    alertsPending: boolean;
    alertsFetchError: boolean;
    alertsFiltered: boolean;
    activeCountryId?: string;
    handleCountryClick: (id: string | undefined) => void;
    activeCountryName?: string;
    countryAlerts?: Alert[];
    activePage: number;
    setActivePage: (page: number) => void;
    totalAlertCount: number;
    activeAlertId?: string;
    handleAlertClick: (id: string | undefined) => void;
    alertInfo?: AlertInfoDetail[];
    activeAdmin1Id?: string;
    setActiveAdmin1Id?: (id: string | undefined) => void;
    admin1Alerts: Admin1Alerts[];
    activeAdmin1Page: number;
    setActiveAdmin1Page: (page: number) => void;
    admin1AlertCount: number;
}

const defaultMaxItemsPerPage = 10;

export type TabKeys = 'admin1' | 'alert';

function AlertsAside(props: Props) {
    const {
        className,
        countriesWithAlert,
        alertsPending,
        alertsFetchError,
        alertsFiltered,
        handleCountryClick,
        activeCountryId,
        activeCountryName,
        countryAlerts,
        activePage,
        setActivePage,
        totalAlertCount,
        handleAlertClick,
        activeAlertId,
        alertInfo,
        activeAdmin1Id,
        setActiveAdmin1Id,
        admin1Alerts,
        activeAdmin1Page,
        setActiveAdmin1Page,
        admin1AlertCount,
    } = props;

    const strings = useTranslation(i18n);
    const [activeTab, setActiveTab] = useState<TabKeys>('alert');

    const variables: CountryAdmin1QueryVariables = useMemo(() => ({
        pk: activeCountryId,
    }), [activeCountryId]);

    const {
        data: countryAdmin1Response,
    } = useQuery<CountryAdmin1Query, CountryAdmin1QueryVariables>(
        COUNTRY_ADMIN1,
        {
            skip: isNotDefined(variables),
            variables,
        },
    );

    const countryRendererParams = useCallback(
        (_: string, value: Country) => ({
            data: value,
            onCountryClick: handleCountryClick,
        }),
        [handleCountryClick],
    );

    const alertRendererParams = useCallback(
        (_: string, value: Alert) => ({
            data: value,
            onCountryClick: handleAlertClick,
        }),
        [handleAlertClick],
    );

    const admin1RendererParams = useCallback(
        (_: string, value: CountryAdmin1) => ({
            data: value,
            onAdmin1Click: setActiveAdmin1Id,
        }),
        [setActiveAdmin1Id],
    );

    return (
        <Container
            className={_cs(styles.alertAside, className)}
            heading={isNotDefined(activeCountryId) ? (
                strings.alertCountries
            ) : (
                `${activeCountryName}`
            )}
            withHeaderBorder
            childrenContainerClassName={styles.mainContent}
            actions={isDefined(activeCountryId) && (
                <Button
                    name={activeCountryId}
                    onClick={handleCountryClick}
                    variant="tertiary"
                    icons={(
                        <ChevronLeftLineIcon className={styles.icon} />
                    )}
                >
                    {strings.alertBack}
                </Button>
            )}
        >
            {isNotDefined(activeCountryId) && (
                <List
                    className={styles.countryList}
                    data={countriesWithAlert}
                    keySelector={stringIdSelector}
                    renderer={CountryListItem}
                    errored={alertsFetchError}
                    pending={alertsPending}
                    filtered={alertsFiltered}
                    rendererParams={countryRendererParams}
                    compact
                />
            )}
            <div className={styles.alertTabs}>
                {isDefined(activeCountryId) && (
                    <Tabs
                        value={activeTab}
                        onChange={setActiveTab}
                        variant="primary"
                    >
                        <TabList>
                            <Tab name="alert">
                                {strings.alertsAsideAlert}
                            </Tab>
                            <Tab name="admin1">
                                {strings.alertsAsideAdmin}
                            </Tab>
                        </TabList>
                        <TabPanel name="alert">
                            {isDefined(activeCountryId) && isNotDefined(activeAlertId) && (
                                <Container
                                    footerActions={(
                                        <Pager
                                            activePage={activePage}
                                            itemsCount={totalAlertCount}
                                            maxItemsPerPage={defaultMaxItemsPerPage}
                                            onActivePageChange={setActivePage}
                                        />
                                    )}
                                >
                                    <List
                                        className={styles.countryList}
                                        data={countryAlerts}
                                        keySelector={stringIdSelector}
                                        renderer={AlertListItem}
                                        errored={alertsFetchError}
                                        pending={alertsPending}
                                        filtered={alertsFiltered}
                                        rendererParams={alertRendererParams}
                                        compact
                                    />
                                </Container>
                            )}
                            {isDefined(activeAlertId) && isDefined(activeCountryId) && (
                                <AlertDetail
                                    data={alertInfo}
                                />
                            )}
                        </TabPanel>
                        <TabPanel name="admin1">
                            {isDefined(activeCountryId) && isNotDefined(activeAdmin1Id) && (
                                <List
                                    className={styles.countryList}
                                    data={countryAdmin1Response?.public?.country?.admin1s}
                                    keySelector={stringIdSelector}
                                    renderer={Admin1ListItem}
                                    errored={alertsFetchError}
                                    pending={alertsPending}
                                    filtered={alertsFiltered}
                                    rendererParams={admin1RendererParams}
                                    compact
                                />
                            )}
                        </TabPanel>
                    </Tabs>
                )}
            </div>
            {isDefined(activeAdmin1Id) && (
                <Container
                    footerActions={(
                        <Pager
                            activePage={activeAdmin1Page}
                            itemsCount={admin1AlertCount}
                            maxItemsPerPage={defaultMaxItemsPerPage}
                            onActivePageChange={setActiveAdmin1Page}
                        />
                    )}
                >
                    <List
                        className={styles.countryList}
                        data={admin1Alerts}
                        keySelector={stringIdSelector}
                        renderer={AlertListItem}
                        errored={alertsFetchError}
                        pending={alertsPending}
                        filtered={alertsFiltered}
                        rendererParams={alertRendererParams}
                        compact
                    />
                </Container>
            )}
            {
                isDefined(activeAlertId)
                && isDefined(activeCountryId)
                && isDefined(activeAdmin1Id) && (
                    <AlertDetail
                        data={alertInfo}
                    />
                )
            }
        </Container>
    );
}

export default AlertsAside;
