import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    generatePath,
    Link,
} from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    ChevronRightLineIcon,
    ShareBoxFillIcon,
} from '@ifrc-go/icons';
import {
    Container,
    DateOutput,
    RawList,
    Tab,
    TabList,
    Tabs,
    TextOutput,
} from '@ifrc-go/ui';
import {
    useButtonFeatures,
    useTranslation,
} from '@ifrc-go/ui/hooks';
import { resolveToString } from '@ifrc-go/ui/utils';
import {
    isDefined,
    isNotDefined,
    listToMap,
} from '@togglecorp/fujs';

import {
    AlertInfoQuery,
    AlertInfoQueryVariables,
} from '#generated/types/graphql';
import routes from '#routes';
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
        info {
          event
          categoryDisplay
          category
          language
          responseType
          responseTypeDisplay
          urgencyDisplay
          severityDisplay
          certaintyDisplay
          id
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
            parameters {
              id
              value
              valueName
            }
            parameter
            areas {
              polygons {
                value
                id
                alertInfoAreaId
              }
              id
            }
          }
        sender
        sent
        admin1s {
          isUnknown
        }
        url
        identifier
        scope
        restriction
        references
        id
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

    const originLinkProps = useButtonFeatures({
        icons: <ShareBoxFillIcon />,
        children: strings.alertOrigin,
        className: styles.links,
    });

    const moreDetailsLinkProps = useButtonFeatures({
        actions: <ChevronRightLineIcon />,
        children: strings.alertViewDetails,
        className: styles.links,
    });

    return (
        <Container
            className={styles.alertDetails}
            heading={data?.info?.event}
            headingLevel={3}
            contentViewType="vertical"
            headerDescription={unknownAdmin1Alerts && (
                <div className={styles.tag}>
                    {strings.alertUnknownAdmin1}
                </div>
            )}
            spacing="comfortable"
        >
            <Container
                contentViewType="vertical"
                spacing="compact"
            >
                <TextOutput
                    strongLabel
                    label={strings.alertSentBy}
                    value={data?.sender}
                />
                <TextOutput
                    strongLabel
                    label={strings.alertSentOn}
                    value={(
                        <DateOutput
                            className={styles.date}
                            value={data?.sent}
                            format="MM/dd/yyyy hh:mm:ss"
                        />
                    )}
                />
                {data?.url && (
                    <Link
                        to={data?.url}
                        target="_blank"
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...originLinkProps}
                    />
                )}
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
            </Container>
            <Container
                heading={strings.alertDetailsHeading}
                headingLevel={4}
                contentViewType="vertical"
                withHeaderBorder
                empty={isNotDefined(data) || isNotDefined(data.infos) || data.infos.length === 0}
                spacing="compact"
            >
                <Tabs
                    value={activeTab as string}
                    onChange={setActiveTab}
                    variant="tertiary"
                >
                    <TabList>
                        {data?.infos.map(
                            (info, index) => (
                                <Tab
                                    key={info.id}
                                    name={info.id}
                                >
                                    {resolveToString(strings.infoTabLabel, { infoNum: index + 1 })}
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
            {isDefined(data) && (
                <Link
                    to={generatePath(routes.alertDetails.absolutePath, { alertId: data.id })}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...moreDetailsLinkProps}
                    target="_blank"
                />
            )}
        </Container>
    );
}

export default AlertDetail;
