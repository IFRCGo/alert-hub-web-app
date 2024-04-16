import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import { useParams } from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    BlockLoading,
    Container,
    List,
    Tab,
    TabList,
    Tabs,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    isNotDefined,
    listToMap,
} from '@togglecorp/fujs';

import Page from '#components/Page';
import {
    AlertDetailsQuery,
    AlertDetailsQueryVariables,
} from '#generated/types/graphql';

import AreaAlertInfo from './AreaAlertInfo';
import CountryAlertInfo from './CountryAlertInfo';
import CountryAlertMap from './CountryAlertMap';

import i18n from './i18n.json';
import styles from './styles.module.css';

const GET_ALERT_DETAILS = gql`
    query AlertDetails($pk: ID!) {
        public {
            alert(pk: $pk) {
                id
                url
                sender
                msgType
                msgTypeDisplay
                sent
                source
                scope
                restriction
                references
                note
                incidents
                identifier
                status
                statusDisplay
                code
                addresses
                info {
                    alertId
                    event
                    id
                    description
                }
                infos {
                    language
                    id
                }
                country {
                    id
                    name
                    iso3
                    bbox
                    filteredAlertCount
                    region {
                        name
                        id
                    }
                    admin1s {
                        id
                        filteredAlertCount
                        name
                    }
                }
            }
        }
    }
`;

type TabKey = string[];
const keySelector = (info: string) => Number(info);

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { alertId } = useParams();
    const strings = useTranslation(i18n);
    const [tabKeys, setTabKeys] = useState<TabKey>([]);
    const [activeTab, setActiveTab] = useState<string>(tabKeys?.[0]);

    const variables = useMemo(() => (
        alertId ? ({
            pk: alertId,
        }) : undefined
    ), [alertId]);

    const {
        loading,
        data: alertResponse,
    } = useQuery<AlertDetailsQuery, AlertDetailsQueryVariables>(
        GET_ALERT_DETAILS,
        {
            skip: isNotDefined(variables),
            variables,
        },
    );

    const data = alertResponse?.public?.alert;

    const description = useMemo(
        () => (
            <div>
                {`${data?.country.name} ${data?.country.region.name} Admin1s: ${data?.country.admin1s?.map((admin) => admin.name).join(' ,')}`}
            </div>
        ),
        [data],
    );

    useMemo(() => {
        const newList = listToMap(
            data?.infos ?? [],
            (d) => d.id,
            (d) => d?.language,
        );
        setTabKeys(Object.keys(newList));
        setActiveTab(Object.keys(newList)?.[0]);

        return newList;
    }, [data?.infos]);

    // NOTE: tab are dynamic as per language
    const getTabName = useCallback((index: number) => `Info ${index + 1}`, []);

    const rendererParams = useCallback((_: number, info: string, index: number) => ({
        title: getTabName(index),
        infoId: info,
    }), [getTabName]);

    return (
        <Page
            title={strings.countryAlertPageTitle}
            className={styles.alertDetail}
            heading={data?.info?.event}
            description={description}
            descriptionContainerClassName={styles.headingDescription}
        >
            <Container childrenContainerClassName={styles.content}>
                { loading && <BlockLoading /> }
                <Container>
                    <CountryAlertMap data={data} />
                </Container>
                <Container>
                    <CountryAlertInfo data={data} />
                </Container>
            </Container>
            <Container>
                <Tabs
                    value={activeTab}
                    onChange={setActiveTab}
                    variant="primary"
                >
                    <TabList>
                        {/* TODO: use list for tab */}
                        {tabKeys?.map((tab, index: number) => (
                            <Tab key={tab} name={tab}>
                                {getTabName(index)}
                            </Tab>
                        ))}
                    </TabList>
                    <List
                        data={tabKeys}
                        renderer={AreaAlertInfo}
                        rendererParams={rendererParams}
                        keySelector={keySelector}
                        pending={false}
                        filtered={false}
                        errored={false}
                    />
                </Tabs>
            </Container>
        </Page>
    );
}

Component.displayName = 'AlertDetails';
