import {
    useContext,
    useMemo,
    useState,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    Container,
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import {
    CountryDetailQuery,
    CountryDetailQueryVariables,
} from '#generated/types/graphql';

import AlertDataContext from '../../../AlertDataContext';
import Admin1Alerts from '../Admin1Alerts';
import AlertDetail from '../AlertDetail';
import CountryAdmin1List from '../CountryAdmin1List';
import CountryAlerts from '../CountryAlerts';

import i18n from './i18n.json';
import styles from './styles.module.css';

const COUNTRY_DETAIL = gql`
query CountryDetail($countryId: ID!) {
    public {
        id
        country(pk: $countryId) {
            id
            bbox
            name
            iso3
            ifrcGoId
            alertCount
            admin1s {
                id
                countryId
                filteredAlertCount
                name
            }
        }
    }
}
`;

interface Props {
    countryId: string;
}

function CountryDetail(props: Props) {
    const { countryId } = props;
    const strings = useTranslation(i18n);
    const {
        activeAlertId,
        activeAdmin1Id,
        setActiveCountryDetails,
    } = useContext(AlertDataContext);

    useQuery<CountryDetailQuery, CountryDetailQueryVariables>(
        COUNTRY_DETAIL,
        {
            variables: isDefined(countryId) ? { countryId } : undefined,
            skip: isNotDefined(countryId),
            onCompleted: (response) => {
                setActiveCountryDetails(response);
            },
        },
    );

    type TabKey = 'alerts' | 'admin1';
    const [activeTab, setActiveTab] = useState<TabKey>('alerts');

    const children = useMemo(
        () => {
            if (isDefined(activeAlertId)) {
                return (
                    <AlertDetail
                        alertId={activeAlertId}
                    />
                );
            }

            if (isDefined(activeAdmin1Id)) {
                return (
                    <Admin1Alerts
                        admin1Id={activeAdmin1Id}
                    />
                );
            }

            return (
                <Tabs
                    value={activeTab}
                    onChange={setActiveTab}
                    styleVariant="nav"
                >
                    <Container
                        className={styles.tabContainer}
                        withContentOverflow
                        headerDescription={(
                            <TabList>
                                <Tab name="alerts">
                                    {strings.alertsAsideAlert}
                                </Tab>
                                <Tab name="admin1">
                                    {strings.alertsAsideAdmin}
                                </Tab>
                            </TabList>
                        )}
                    >
                        <TabPanel
                            name="alerts"
                            className={styles.tabPanel}
                        >
                            <CountryAlerts
                                countryId={countryId}
                            />
                        </TabPanel>
                        <TabPanel name="admin1">
                            <CountryAdmin1List
                                countryId={countryId}
                            />
                        </TabPanel>
                    </Container>
                </Tabs>
            );
        },
        [activeAlertId, activeAdmin1Id, activeTab, strings, countryId],
    );

    return children;
}

export default CountryDetail;
