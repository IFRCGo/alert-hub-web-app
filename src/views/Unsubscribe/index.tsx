import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';
import {
    gql,
    useMutation,
    useQuery,
} from '@apollo/client';
import {
    ConfirmButton,
    Message,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { isNotDefined } from '@togglecorp/fujs';

import Page from '#components/Page';
import {
    AlertSubscriptionQuery,
    AlertSubscriptionQueryVariables,
    UnsubscriptionMutation,
    UnsubscriptionMutationVariables,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';

import i18n from './i18n.json';
import styles from './styles.module.css';

const ALERT_SUBSCRIPTION = gql`
    query AlertSubscription(
        $pk: ID!
    ) {
          private {
            userAlertSubscription(pk: $pk) {
                id
                filterAlertCountryId
                filterAlertAdmin1s
                name
                isActive
            }
        }
    }
`;

const UPDATE_SUBSCRIPTION = gql`
    mutation Unsubscription(
        $subscriptionId: ID!,
        $data: UserAlertSubscriptionInput!,
    ) {
        private {
            updateUserAlertSubscription(
                id: $subscriptionId,
                data: $data,
            ) {
                errors
                ok
                result {
                    id
                    isActive
                }
            }
        }
    }
`;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { subscriptionId } = useParams<{ subscriptionId?: string, token?: string }>();
    const alert = useAlert();
    const navigate = useNavigate();
    const strings = useTranslation(i18n);
    const [isErrored, setIsError] = useState(false);

    const decodedSubscriptionId = typeof subscriptionId === 'string'
        ? atob(subscriptionId) : undefined;

    const variables = useMemo(() => (decodedSubscriptionId
        ? { pk: decodedSubscriptionId } : undefined
    ), [decodedSubscriptionId]);

    const {
        data: alertSubscription,
    } = useQuery<
        AlertSubscriptionQuery,
        AlertSubscriptionQueryVariables
    >(
        ALERT_SUBSCRIPTION,
        {
            skip: isNotDefined(variables),
            variables,
            onCompleted: (data) => {
                if (!data?.private?.userAlertSubscription) {
                    alert.show(
                        strings.subscribeNotAvailable,
                        { variant: 'info' },
                    );
                    navigate('/');
                }
            },
            onError: () => {
                alert.show(
                    strings.unsubscriptionFailed,
                    { variant: 'danger' },
                );
            },
        },
    );

    const [
        subscriptionUpdate,
    ] = useMutation<
        UnsubscriptionMutation,
        UnsubscriptionMutationVariables
    >(
        UPDATE_SUBSCRIPTION,
        {
            onCompleted: (response) => {
                const subscriptionResponse = response?.private.updateUserAlertSubscription;
                if (!response) {
                    return;
                }
                if (subscriptionResponse.ok) {
                    alert.show(
                        strings.unsubscribeSuccessfully,
                        { variant: 'success' },
                    );
                    navigate('/');
                } else {
                    setIsError(true);
                }
            },
            onError: () => {
                alert.show(
                    strings.unsubscriptionFailed,
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleUnsubscribe = useCallback(() => {
        const data = alertSubscription?.private?.userAlertSubscription;
        if (subscriptionId && data) {
            subscriptionUpdate({
                variables: {
                    subscriptionId,
                    data: {
                        isActive: false,
                        filterAlertAdmin1s: data.filterAlertAdmin1s,
                        filterAlertCountry: data.filterAlertCountryId,
                        name: data.name,
                    },
                },
            });
        }
    }, [
        alertSubscription?.private?.userAlertSubscription,
        subscriptionId,
        subscriptionUpdate,
    ]);

    if (isErrored) {
        return (
            <Page>
                <Message
                    title={strings.unsubscriptionFailed}
                />
            </Page>
        );
    }

    return (
        <Page
            mainSectionContainerClassName={styles.unsubscribe}
        >
            <ConfirmButton
                name="unsubscribe"
                variant="primary"
                onConfirm={handleUnsubscribe}
                confirmHeading={strings.unsubscribeConfirmHeading}
                confirmMessage={strings.unsubscribeConfirmMessage}
            >
                {strings.unsubscribeConfirmHeading}
            </ConfirmButton>
        </Page>
    );
}
Component.displayName = 'Unsubscribe';
