import {
    useCallback,
    useState,
} from 'react';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    ConfirmButton,
    Message,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { isDefined } from '@togglecorp/fujs';

import Page from '#components/Page';
import {
    UnsubscribeAlertSubscriptionMutation,
    UnsubscribeAlertSubscriptionMutationVariables,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';

import i18n from './i18n.json';
import styles from './styles.module.css';

const UNSUBSCRIBE_ALERT = gql`
    mutation UnsubscribeAlertSubscription(
        $data: UserAlertSubscriptionUnsubscribeInput!
    ) {
        public {
            unsubscribeUserAlertSubscription(data: $data) {
                ok
                errors
            }
        }
    }
`;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { subscriptionId, token } = useParams<{ subscriptionId?: string, token?: string }>();
    const alert = useAlert();
    const navigate = useNavigate();
    const strings = useTranslation(i18n);
    const [isErrored, setIsError] = useState(false);

    const [
        subscriptionUpdate,
    ] = useMutation<
        UnsubscribeAlertSubscriptionMutation,
        UnsubscribeAlertSubscriptionMutationVariables
    >(
        UNSUBSCRIBE_ALERT,
        {
            onCompleted: (response) => {
                const subscriptionResponse = response?.public.unsubscribeUserAlertSubscription;
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
                    const errorMessages = subscriptionResponse?.errors
                        ?.map((error: { messages: string; }) => error.messages)
                        .filter(isDefined)
                        .join(', ');
                    alert.show(errorMessages, { variant: 'danger' });
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
        if (subscriptionId && token) {
            subscriptionUpdate({
                variables: {
                    data: {
                        uuid: subscriptionId,
                        token,
                    },
                },
            });
        }
    }, [
        subscriptionId,
        subscriptionUpdate,
        token,
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
