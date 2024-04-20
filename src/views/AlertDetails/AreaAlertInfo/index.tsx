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
    DateOutput,
    List,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import {
    GetAreaAlertInfoQuery,
    GetAreaAlertInfoQueryVariables,
} from '#generated/types/graphql';
import { stringIdSelector } from '#utils/selectors';

import AreaInfoDetail from './AreaInfoDetail';

import i18n from './i18n.json';

interface Props {
    infoId: string;
}

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
                    polygons {
                        id
                        value
                        alertInfoAreaId
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

type AreaInfo = NonNullable<NonNullable<GetAreaAlertInfoQuery['public']>['alertInfo']>['areas'][number];

function AreaAlertInfo(props: Props) {
    const {
        infoId,
    } = props;

    const strings = useTranslation(i18n);

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
        },
    );

    const data = areaAlertResponse?.public?.alertInfo;
    const initialActiveTab = data?.areas[0]?.id || '';
    const [activeTab, setActiveTab] = useState<string>(initialActiveTab);

    const rendererParams = useCallback((_: string, value: AreaInfo) => ({
        data: value,
    }), []);

    return (
        <TabPanel name={infoId}>
            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                variant="tertiary"
            >
                <TabList>
                    {data?.areas?.map((area: AreaInfo, index: number) => (
                        <Tab name={area?.id}>
                            {strings.alertInfoArea}
                            {index + 1}
                        </Tab>
                    ))}
                </TabList>
                <List
                    data={data?.areas}
                    renderer={AreaInfoDetail}
                    rendererParams={rendererParams}
                    keySelector={stringIdSelector}
                    pending={areaAlertLoading}
                    filtered={false}
                    errored={isDefined(areaAlertError)}
                />
            </Tabs>
            <TextOutput
                label={strings.alertInfoHeadline}
                value={data?.headline}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoLanguage}
                value={data?.language}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoEvent}
                value={data?.event}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoUrgency}
                value={data?.urgency}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoSeverity}
                value={(
                    <DateOutput
                        value={data?.severityDisplay}
                    />
                )}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoCertainty}
                value={data?.certaintyDisplay}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoOnset}
                value={data?.onset}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoExpires}
                value={data?.expires}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoSenderName}
                value={data?.senderName}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoAreaDescription}
                value=""
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoDescription}
                value={data?.description}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoInstruction}
                value={data?.instruction}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoCategory}
                value={data?.categoryDisplay}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoResponseType}
                value={data?.responseType}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoAudience}
                value={data?.audience}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoEventCode}
                value={data?.eventCode}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoEffective}
                value={data?.effective}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoWeb}
                value={data?.web}
                withoutLabelColon
            />
            <TextOutput
                label={strings.alertInfoContact}
                value={data?.contact}
                withoutLabelColon
            />
        </TabPanel>
    );
}

export default AreaAlertInfo;
