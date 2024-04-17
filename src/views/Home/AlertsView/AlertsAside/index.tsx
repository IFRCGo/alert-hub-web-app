import {
    useCallback,
    useState,
} from 'react';
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
    Admin1ListQuery,
    AlertInfosQuery,
    CountryAlertsListQuery,
    CountryListQuery,
} from '#generated/types/graphql';
import { stringIdSelector } from '#utils/selectors';

import Admin1ListItem from './Admin1ListItem';
import AlertDetail from './AlertDetail';
import AreaAlertInfo from './AlertInfo';
import AlertListItem from './AlertListItem';
import CountryListItem from './CountryListItem';

import i18n from './i18n.json';
import styles from './styles.module.css';

type CountryType = NonNullable<NonNullable<CountryListQuery['public']>['allCountries']>[number];

type Admin1Type = NonNullable<NonNullable<NonNullable<Admin1ListQuery['public']>['admin1s']>['items']>[number];

type AlertType = NonNullable<NonNullable<NonNullable<CountryAlertsListQuery['public']>['alerts']>['items']>[number];

type AlertInfosType = NonNullable<NonNullable<AlertInfosQuery['public']>['alert']>;

type InfoAlertType = NonNullable<NonNullable<NonNullable<AlertInfosQuery['public']>['alert']>['infos']>[number];

interface Props {
    className?: string;
    countriesWithAlert?: CountryType[];
    alertsPending: boolean;
    alertsFetchError: boolean;
    alertsFiltered: boolean;
    activeCountryId?: string;
    handleCountryClick: (id: string | undefined) => void;
    activeCountryName?: string;
    admin1sWithActiveAlert?: Admin1Type[];
    countryAlerts?: AlertType[];
    activePage: number;
    setActivePage: (page: number) => void;
    alertCount: number;
    activeAlertId?: string;
    handleAlertClick: (id: string | undefined) => void;
    alertInfos?: AlertInfosType[];
    infoAlert?: InfoAlertType[];
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
        admin1sWithActiveAlert,
        countryAlerts,
        activePage,
        setActivePage,
        alertCount,
        handleAlertClick,
        activeAlertId,
        alertInfos,
        infoAlert,
    } = props;

    const strings = useTranslation(i18n);
    const [activeTab, setActiveTab] = useState<TabKeys>('alert');

    const countryRendererParams = useCallback(
        (_: string, value: CountryType) => ({
            data: value,
            onCountryClick: handleCountryClick,
        }),
        [handleCountryClick, activeCountryId],
    );

    const alertRendererParams = useCallback(
        (_: string, value: AlertType) => ({
            data: value,
            onCountryClick: handleAlertClick,
        }),
        [handleAlertClick, activeCountryId],
    );

    const admin1RendererParams = useCallback(
        (_: string, value: Admin1Type) => ({
            data: value,
        }),
        [activeCountryId],
    );

    return (
        <Container
            className={_cs(styles.alertAside, className)}
            heading={isNotDefined(activeCountryId) ? (
                strings.alertCountries
            ) : (
                ` ${strings.alertsAside} ${activeCountryName}`
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
            footerActions={isDefined(activeCountryId) && isNotDefined(activeAlertId) && (
                <Pager
                    activePage={activePage}
                    itemsCount={alertCount}
                    maxItemsPerPage={defaultMaxItemsPerPage}
                    onActivePageChange={setActivePage}
                />
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
                            )}
                            {isDefined(activeAlertId) && isDefined(activeCountryId) && (
                                <>
                                    <AlertDetail
                                        data={alertInfos}
                                    />
                                    <AreaAlertInfo
                                        infoId={alertInfos?.infos}
                                        data={infoAlert}
                                    />
                                </>
                            )}
                        </TabPanel>
                        <TabPanel name="admin1">
                            {isDefined(activeCountryId) && (
                                <List
                                    className={styles.countryList}
                                    data={admin1sWithActiveAlert}
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
        </Container>
    );
}

export default AlertsAside;
