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
    ListView,
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

import Link from '#components/Link';
import {
    GetAreaAlertInfoQuery,
    GetAreaAlertInfoQueryVariables,
} from '#generated/types/graphql';
import { DATE_FORMAT } from '#utils/constants';
import { stringIdSelector } from '#utils/selectors';

import AreaInfoDetail from './AreaInfoDetail';

import i18n from './i18n.json';
import styles from './styles.module.css';

const GET_AREA_ALER_INFO = gql`
    query GetAreaAlertInfo($pk: ID!) {
        public {
            id
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
                        alertInfoAreaId
                        value
                    }
                    polygons {
                        alertInfoAreaId
                        id
                        valuePolygon
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
                headingLevel={3}
                headerDescription={data?.description}
                headerActions={(
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
                spacing="lg"
            >
                <ListView
                    layout="block"
                    spacing="lg"
                >
                    <ListView
                        layout="grid"
                        numPreferredGridColumns={4}
                    >
                        <TextOutput
                            label={strings.alertInfoEffective}
                            value={data?.effective}
                            format={DATE_FORMAT}
                            valueType="date"
                            strongValue
                        />
                        <TextOutput
                            label={strings.alertInfoOnset}
                            value={data?.onset}
                            format={DATE_FORMAT}
                            strongValue
                            valueType="date"
                        />
                        <TextOutput
                            label={strings.alertInfoExpires}
                            value={data?.expires}
                            format={DATE_FORMAT}
                            strongValue
                            valueType="date"
                        />
                        <TextOutput
                            label={strings.alertInfoEvent}
                            value={data?.event}
                            format={DATE_FORMAT}
                            valueType="date"
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
                            value={isTruthyString(data?.web) && (
                                <Link
                                    className={styles.alertInfoWebLink}
                                    href={data.web}
                                    external
                                >
                                    {data.web}
                                </Link>
                            )}
                            strongValue
                        />
                        <TextOutput
                            label={strings.alertInfoContact}
                            value={data?.contact}
                            strongValue
                        />
                    </ListView>
                    {isTruthyString(data?.instruction) && (
                        <Container
                            heading={strings.alertInfoInstruction}
                            withHeaderBorder
                        >
                            {data?.instruction}
                        </Container>
                    )}
                    <Container
                        heading={strings.alertInfoAffectedArea}
                        empty={isNotDefined(data) || data.areas.length === 0}
                        emptyMessage={strings.alertEmptyMessage}
                        withHeaderBorder
                    >
                        <Tabs
                            value={activeArea}
                            onChange={setActiveArea}
                            styleVariant="vertical-compact"
                        >
                            <ListView
                                layout="grid"
                                numPreferredGridColumns={5}
                            >
                                <TabList
                                    className={styles.areaTabList}
                                >
                                    {data?.areas?.map((area: AreaInfo, index: number) => (
                                        <Tab
                                            key={area.id}
                                            name={area.id}
                                            className={_cs(
                                                styles.areaTab,
                                                area.id === activeArea && styles.active,
                                            )}
                                        >
                                            {resolveToString(
                                                strings.alertInfoArea,
                                                { areaNum: index + 1 },
                                            )}
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
                            </ListView>
                        </Tabs>
                    </Container>
                </ListView>
            </Container>
        </TabPanel>
    );
}

export default AlertInfo;
