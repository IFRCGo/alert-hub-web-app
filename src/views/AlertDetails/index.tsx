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
    Container,
    Label,
    ListView,
    RawList,
    Tab,
    TabList,
    Tabs,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { resolveToString } from '@ifrc-go/ui/utils';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import Page from '#components/Page';
import {
    AlertDetailsQuery,
    AlertDetailsQueryVariables,
} from '#generated/types/graphql';
import { stringIdSelector } from '#utils/selectors';

import AlertInfo from './AlertInfo';
import AlertMetadata from './AlertMetadata';
import CountryAlertMap from './CountryAlertMap';

import i18n from './i18n.json';
import styles from './styles.module.css';

type Alert = NonNullable<AlertDetailsQuery['public']['alert']>;
type Info = Alert['infos'][number];

const GET_ALERT_DETAILS = gql`
    query AlertDetails($pk: ID!) {
        public {
            id
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
                    region {
                        name
                        id
                    }
                }
                admin1s {
                    id
                    name
                    bbox
                    ifrcGoId
                }
            }
        }
    }
`;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { alertId } = useParams();
    const strings = useTranslation(i18n);

    const [activeInfoTab, setActiveInfoTab] = useState<string>('default');

    const variables = useMemo(() => (
        alertId ? ({
            pk: alertId,
        }) : undefined
    ), [alertId]);

    const {
        loading: alertLoading,
        error: alertError,
        data: alertResponse,
    } = useQuery<AlertDetailsQuery, AlertDetailsQueryVariables>(
        GET_ALERT_DETAILS,
        {
            skip: isNotDefined(variables),
            variables,
            onCompleted: (response) => {
                const firstInfoId = response.public.alert?.infos?.[0].id;
                if (isDefined(firstInfoId)) {
                    setActiveInfoTab(firstInfoId);
                }
            },
        },
    );

    const data = alertResponse?.public?.alert;

    const description = useMemo(
        () => {
            if (isNotDefined(data)) {
                return undefined;
            }

            return (
                <ListView
                    layout="block"
                >
                    <ListView
                        layout="inline"
                    >
                        <Label
                            textSize="lg"
                            strong
                        >
                            {data?.country.name}
                        </Label>
                        <Label
                            textSize="lg"
                            strong
                        >
                            /
                        </Label>
                        <Label
                            textSize="lg"
                            strong
                        >
                            {data?.country.region.name}
                        </Label>
                    </ListView>
                    <Label
                        textSize="md"
                    >
                        {data?.admin1s?.map((admin) => admin.name).join(', ')}
                    </Label>
                </ListView>
            );
        },
        [data],
    );

    const getTabName = useCallback(
        (index: number) => resolveToString(strings.countryAlertPageInfo, { infoNum: index + 1 }),
        [strings.countryAlertPageInfo],
    );

    const rendererParams = useCallback((_: string, info: Info, index: number) => ({
        altTitle: getTabName(index),
        infoId: info.id,
        className: styles.alertInfo,
    }), [getTabName]);

    return (
        <Page
            title={strings.countryAlertPageTitle}
            className={styles.alertDetail}
            heading={data?.info?.event ?? '--'}
            description={description}
        >
            <Container
                pending={alertLoading}
                overlayPending
                spacing="md"
                errored={isDefined(alertError)}
                errorMessage={alertError?.message}
            >
                <ListView
                    layout="grid"
                    withSidebar
                    sidebarPosition="end"
                >
                    <CountryAlertMap
                        data={data}
                    />
                    <AlertMetadata
                        className={styles.sidebar}
                        data={data}
                    />
                </ListView>
            </Container>
            {isDefined(data) && isDefined(data.infos) && (
                <Container
                    spacing="md"
                >
                    <Tabs
                        value={activeInfoTab}
                        onChange={setActiveInfoTab}
                        styleVariant="tab"

                    >
                        <TabList>
                            {data?.infos?.map(
                                (info, index) => (
                                    <Tab
                                        key={info.id}
                                        name={info.id}
                                    >
                                        {getTabName(index)}
                                    </Tab>
                                ),
                            )}
                        </TabList>
                        <RawList
                            data={data?.infos}
                            renderer={AlertInfo}
                            rendererParams={rendererParams}
                            keySelector={stringIdSelector}
                        />
                    </Tabs>
                </Container>
            )}
        </Page>
    );
}

Component.displayName = 'AlertDetails';
