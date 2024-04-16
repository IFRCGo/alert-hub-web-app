import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    BlockLoading,
    Container,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { isNotDefined } from '@togglecorp/fujs';

import Page from '#components/Page';
import {
    AlertDetailsQuery,
    AlertDetailsQueryVariables,
} from '#generated/types/graphql';

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
                country {
                    id
                    name
                    iso3
                    centroid
                    filteredAlertCount
                    region {
                        name
                        id
                    }
                    admin1s {
                        id
                        filteredAlertCount
                        maxLatitude
                        maxLongitude
                        minLatitude
                        minLongitude
                        polygon
                        name
                    }
                }
            }
        }
    }
`;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { alertId } = useParams();
    const strings = useTranslation(i18n);

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

    return (
        <Page
            title={strings.countryAlertPageTitle}
            className={styles.alertDetail}
            heading={data?.info?.event}
            description={description}
            descriptionContainerClassName={styles.headingDescription}
        >
            <Container
                childrenContainerClassName={styles.content}
            >
                { loading && <BlockLoading /> }
                <Container>
                    <CountryAlertMap data={data} />
                </Container>
                <Container>
                    <CountryAlertInfo data={data} />
                </Container>
            </Container>
        </Page>
    );
}

Component.displayName = 'AlertDetails';
