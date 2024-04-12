import react, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { Container } from '@ifrc-go/ui';
import { isNotDefined } from '@togglecorp/fujs';

import Page from '#components/Page';
import {
    AlertDetailsQuery,
    AlertDetailsQueryVariables,
} from '#generated/types/graphql';

import styles from './style.module.css';

const GET_ALERT_DETAILS = gql`
    query AlertDetails($pk: ID!) {
        public {
            alert(pk: $pk) {
                id
                info {
                    alertId
                    event
                    id
                    description
                }
                country {
                    id
                    name
                    region {
                        name
                        id
                    }
                    admin1s {
                        id
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

    const variables = useMemo(() => (
        alertId ? ({
            pk: alertId,
        }) : undefined
    ), [alertId]);

    const {
        loading,
        previousData,
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
            title="alerts"
            className={styles.alertDetail}
            heading={data?.info?.event}
            description={description}
            descriptionContainerClassName={styles.headingDescription}
        >
            <Container
                childrenContainerClassName={styles.content}
            >
                <Container>
                    Map section
                </Container>
                <Container>
                    Alert section
                </Container>
            </Container>
        </Page>
    );
}

Component.displayName = 'AlertDetails';
