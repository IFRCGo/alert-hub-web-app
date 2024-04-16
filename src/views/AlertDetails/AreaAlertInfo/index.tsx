import { useMemo } from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { TabPanel } from '@ifrc-go/ui';
import { isNotDefined } from '@togglecorp/fujs';

import {
    GetAreaAlertInfoQuery,
    GetAreaAlertInfoQueryVariables,
} from '#generated/types/graphql';

interface Props {
    title: string;
    infoId: string;
}

const GET_AREA_ALER_INFO = gql`
    query GetAreaAlertInfo($pk: ID!) {
        public {
            alertInfo(pk: $pk) {
                id
                event
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
                }
            }
        }
    }
`;
function AreaAlertInfo(props: Props) {
    const {
        title,
        infoId,
    } = props;

    const variables: GetAreaAlertInfoQueryVariables = useMemo(() => ({
        pk: infoId,
    }), [infoId]);

    const {
        data: response,
    } = useQuery<GetAreaAlertInfoQuery, GetAreaAlertInfoQueryVariables>(
        GET_AREA_ALER_INFO,
        {
            skip: isNotDefined(variables),
            variables,
        },
    );

    const data = response?.public?.alertInfo;
    console.log('alert info data', data);

    return (
        <TabPanel name={infoId}>
            {title}
        </TabPanel>
    );
}

export default AreaAlertInfo;
