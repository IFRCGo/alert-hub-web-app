import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { ShareBoxFillIcon } from '@ifrc-go/icons';
import {
    Container,
    ListView,
    RawList,
    Tab,
    TabList,
    Tabs,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { resolveToString } from '@ifrc-go/ui/utils';
import {
    isDefined,
    isNotDefined,
    listToMap,
} from '@togglecorp/fujs';

import Link from '#components/Link';
import {
    AlertInfoQuery,
    AlertInfoQueryVariables,
} from '#generated/types/graphql';
import { DATE_FORMAT } from '#utils/constants';
import { stringIdSelector } from '#utils/selectors';

import AlertInfo from './AlertInfo';

import i18n from './i18n.json';
import styles from './styles.module.css';

type InfoAlertType = NonNullable<NonNullable<AlertInfoQuery['public']>['alert']>;
type InfosDetail = InfoAlertType['infos'][number];

const ALERT_INFO = gql`
query AlertInfo($alert: ID!) {
    public {
        id
      alert(pk: $alert) {
        id
        info {
          id
          event
          categoryDisplay
          category
          language
          responseType
          responseTypeDisplay
          urgencyDisplay
          severityDisplay
          certaintyDisplay
        }
        infos {
            id
            language
            event
            urgencyDisplay
            severityDisplay
            responseTypeDisplay
            certaintyDisplay
            description
            instruction
            parameter
            audience
            eventCode
            effective
            onset
            expires
            headline
            senderName
            web
            contact
            parameters {
              id
              value
              valueName
            }
            areas {
              id
              polygons {
                id
                value
                alertInfoAreaId
              }
            }
            categoryDisplay
        }
        sender
        sent
        admin1s {
          id
          isUnknown
        }
        url
        identifier
        scope
        restriction
        references
      }
    }
  }
`;

export interface Props {
    alertId: string;
}

function AlertDetail(props: Props) {
    const { alertId } = props;

    const [activeTab, setActiveTab] = useState<string | undefined>();
    const {
        data: alertInfoResponse,
    } = useQuery<AlertInfoQuery, AlertInfoQueryVariables>(
        ALERT_INFO,
        {
            variables: { alert: alertId },
            onCompleted: (response) => {
                setActiveTab(response.public.alert?.infos?.[0]?.id);
            },
        },
    );

    const strings = useTranslation(i18n);

    const data = alertInfoResponse?.public?.alert;

    const unknownAdmin1Alerts = data?.admin1s?.some((admin) => admin.isUnknown);

    useMemo(() => {
        const newList = listToMap(
            data?.infos ?? [],
            (d) => d.id,
            (d) => d?.language,
        );
        setActiveTab(Object.keys(newList)?.[0]);

        return newList;
    }, [data?.infos]);

    const rendererParams = useCallback(
        (_: string, info: InfosDetail) => ({
            data: info,
        }),
        [],
    );

    return (

        <Container
            className={styles.alertDetails}
            heading={data?.info?.event}
            headingLevel={4}
            headerDescription={unknownAdmin1Alerts && (
                <div className={styles.tag}>
                    {strings.alertUnknownAdmin1}
                </div>
            )}
            spacing="md"
            headerActions={data?.url && (
                <Link
                    before={<ShareBoxFillIcon />}
                    href={data?.url}
                    external
                >
                    {strings.alertOrigin}
                </Link>
            )}
        >
            <ListView
                layout="block"
            >
                <ListView
                    layout="block"
                    spacing="2xs"
                >
                    <TextOutput
                        strongLabel
                        label={strings.alertSentBy}
                        value={data?.sender}
                    />
                    <TextOutput
                        strongLabel
                        label={strings.alertSentOn}
                        value={data?.sent}
                        valueType="date"
                        format={DATE_FORMAT}
                    />
                    <TextOutput
                        strongLabel
                        label={strings.alertIdentifier}
                        value={data?.identifier}
                    />
                    <TextOutput
                        strongLabel
                        label={strings.alertScope}
                        value={data?.scope}
                    />
                    <TextOutput
                        strongLabel
                        label={strings.alertRestriction}
                        value={data?.restriction}
                    />
                    {/* NOTE: if required, use same reference output as in alerts detail page
                <TextOutput
                    strongLabel
                    label={strings.alertReference}
                    value={data?.references}
                    valueClassName={styles.referenceValue}
                />
                */}
                </ListView>
                <Container
                    heading={strings.alertDetailsHeading}
                    headingLevel={4}
                    withHeaderBorder
                    empty={isNotDefined(data) || isNotDefined(data.infos)
                         || data.infos.length === 0}
                    emptyMessage={strings.alertEmptyMessage}
                    spacing="sm"
                >
                    <Tabs
                        value={activeTab as string}
                        onChange={setActiveTab}
                        styleVariant="nav"
                    >
                        <ListView
                            layout="block"
                            spacing="xs"
                        >
                            <TabList>
                                {data?.infos.map(
                                    (info, index) => (
                                        <Tab
                                            key={info.id}
                                            name={info.id}
                                        >
                                            {resolveToString(
                                                strings.infoTabLabel,
                                                { infoNum: index + 1 },
                                            )}
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
                        </ListView>
                    </Tabs>
                </Container>
                {isDefined(data) && (
                    <Link
                        to="alertDetails"
                        urlParams={{ alertId: data.id }}
                        withLinkIcon
                        colorVariant="primary"
                        styleVariant="filled"
                        textSize="sm"
                    >
                        {strings.alertViewDetails}
                    </Link>
                )}
            </ListView>
        </Container>
    );
}

export default AlertDetail;
