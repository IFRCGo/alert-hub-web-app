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
    Container,
    List,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { resolveToString } from '@ifrc-go/ui/utils';
import {
    _cs,
    isDefined,
    isNotDefined,
    isTruthyString,
} from '@togglecorp/fujs';

import {
    GetAreaAlertInfoQuery,
    GetAreaAlertInfoQueryVariables,
} from '#generated/types/graphql';
import { stringIdSelector } from '#utils/selectors';

import AreaInfoDetail from './AreaInfoDetail';

import i18n from './i18n.json';
import styles from './styles.module.css';

const GET_AREA_ALER_INFO = gql`
    query GetAreaAlertInfo($pk: ID!) {
        public {
            alertInfo(pk: $pk) {
                id
                event
                eventCode
                headline
                expires
                language
                instruction
                onset
                parameter
                responseType
                responseTypeDisplay
                senderName
                web
                urgencyDisplay
                urgency
                severityDisplay
                severity
                effective
                description
                contact
                certaintyDisplay
                certainty
                categoryDisplay
                category
                audience
                alertId
                areas {
                    id
                    areaDesc
                    ceiling
                    alertInfoId
                    altitude
                    circles {
                        id
                        value
                    }
                    polygons {
                        id
                        value
                    }
                    geocodes {
                        id
                        value
                        valueName
                        alertInfoAreaId
                    }
                }
            }
        }
    }
`;

interface Props {
    altTitle?: string;
    infoId: string;
    className?: string;
}

type AreaInfo = NonNullable<NonNullable<GetAreaAlertInfoQuery['public']>['alertInfo']>['areas'][number];

function AlertInfo(props: Props) {
    const {
        infoId,
        altTitle,
        className,
    } = props;

    const strings = useTranslation(i18n);

    const [activeArea, setActiveArea] = useState<string>('default');

    const variables: GetAreaAlertInfoQueryVariables = useMemo(() => ({
        pk: infoId,
    }), [infoId]);

    const {
        data: areaAlertResponse,
        loading: areaAlertLoading,
        error: areaAlertError,
    } = useQuery<GetAreaAlertInfoQuery, GetAreaAlertInfoQueryVariables>(
        GET_AREA_ALER_INFO,
        {
            skip: isNotDefined(variables),
            variables,
            onCompleted: (response) => {
                const firstAreaId = response.public.alertInfo?.areas?.[0]?.id;
                if (isDefined(firstAreaId)) {
                    setActiveArea(firstAreaId);
                }
            },
        },
    );

    const data = areaAlertResponse?.public?.alertInfo;

    const rendererParams = useCallback((_: string, value: AreaInfo) => ({
        data: value,
    }), []);

    return (
        <TabPanel
            name={infoId}
            className={_cs(styles.alertInfo, className)}
        >
            <Container
                heading={data?.headline ?? altTitle}
                headingLevel={2}
                headerDescription={data?.description}
                headingDescriptionContainerClassName={styles.tags}
                headingDescription={(
                    <>
                        <TextOutput
                            className={styles.badge}
                            label={strings.alertInfoLanguage}
                            value={data?.language}
                            strongValue
                        />
                        <TextOutput
                            className={styles.badge}
                            label={strings.alertInfoCategory}
                            value={data?.categoryDisplay}
                            strongValue
                        />
                        <TextOutput
                            className={styles.badge}
                            label={strings.alertInfoUrgency}
                            value={data?.urgencyDisplay}
                            strongValue
                        />
                        <TextOutput
                            className={styles.badge}
                            label={strings.alertInfoSeverity}
                            value={data?.severityDisplay}
                            strongValue
                        />
                        <TextOutput
                            className={styles.badge}
                            label={strings.alertInfoCertainty}
                            value={data?.certaintyDisplay}
                            strongValue
                        />
                    </>
                )}
                contentViewType="vertical"
                spacing="loose"
            >
                <div className={styles.metadata}>
                    <TextOutput
                        label={strings.alertInfoEffective}
                        value={data?.effective}
                        valueType="date"
                        strongValue
                    />
                    <TextOutput
                        label={strings.alertInfoOnset}
                        value={data?.onset}
                        valueType="date"
                        strongValue
                    />
                    <TextOutput
                        label={strings.alertInfoExpires}
                        value={data?.expires}
                        valueType="date"
                        strongValue
                    />
                    <TextOutput
                        label={strings.alertInfoEvent}
                        value={data?.event}
                        strongValue
                    />
                    <TextOutput
                        label={strings.alertInfoSenderName}
                        value={data?.senderName}
                        strongValue
                    />
                    <TextOutput
                        label={strings.alertInfoResponseType}
                        value={data?.responseType}
                        strongValue
                    />
                    <TextOutput
                        label={strings.alertInfoAudience}
                        value={data?.audience}
                        strongValue
                    />
                    <TextOutput
                        label={strings.alertInfoEventCode}
                        value={data?.eventCode}
                        strongValue
                    />
                    <TextOutput
                        label={strings.alertInfoWeb}
                        value={data?.web}
                        strongValue
                    />
                    <TextOutput
                        label={strings.alertInfoContact}
                        value={data?.contact}
                        strongValue
                    />
                </div>
                {isTruthyString(data?.instruction) && (
                    <Container
                        heading={strings.alertInfoInstruction}
                        withHeaderBorder
                    >
                        {data?.instruction}
                    </Container>
                )}
                <Container
                    // FIXME: use strings
                    heading="Affected areas"
                    empty={isNotDefined(data) || data.areas.length === 0}
                    contentViewType="grid"
                    numPreferredGridContentColumns={5}
                    withHeaderBorder
                >
                    <Tabs
                        value={activeArea}
                        onChange={setActiveArea}
                        variant="vertical-compact"
                    >
                        <TabList
                            className={styles.areaTabList}
                            contentClassName={styles.areaTabListContent}
                        >
                            {data?.areas?.map((area: AreaInfo, index: number) => (
                                <Tab
                                    name={area.id}
                                    className={_cs(
                                        styles.areaTab,
                                        area.id === activeArea && styles.active,
                                    )}
                                >
                                    {resolveToString(strings.alertInfoArea, { areaNum: index + 1 })}
                                </Tab>
                            ))}
                        </TabList>
                        <List
                            className={styles.areaDetails}
                            data={data?.areas}
                            renderer={AreaInfoDetail}
                            rendererParams={rendererParams}
                            keySelector={stringIdSelector}
                            pending={areaAlertLoading}
                            filtered={false}
                            errored={isDefined(areaAlertError)}
                        />
                    </Tabs>
                </Container>
            </Container>
        </TabPanel>
    );
}

export default AlertInfo;
