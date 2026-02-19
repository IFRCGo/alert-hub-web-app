import {
    useEffect,
    useState,
} from 'react';
import { useParams } from 'react-router-dom';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    ListView,
    Message,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Link from '#components/Link';
import Page from '#components/Page';
import useAlert from '#hooks/useAlert';

import i18n from './i18n.json';

const ACCOUNT_ACTIVATION_MUTATION = gql`
    mutation AccountActivation($data: UserActivationInput!) {
        public {
            accountActivation(data: $data) {
                errors
                ok
            }
        }
    }
`;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { userId, token } = useParams<{ userId?: string, token?: string }>();
    const alert = useAlert();
    const strings = useTranslation(i18n);
    const [isErrored, setIsError] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [
        activate,
    ] = useMutation(ACCOUNT_ACTIVATION_MUTATION, {
        onCompleted: (response) => {
            const activateRes = response?.public?.accountActivation;
            if (!response) {
                return;
            }
            if (activateRes.ok) {
                setIsSubmitted(true);
            } else {
                setIsError(true);
            }
        },
        onError: () => {
            alert.show(
                strings.activationFailMessage,
                { variant: 'danger' },
            );
        },
    });

    useEffect(() => {
        if (userId && token) {
            activate({
                variables: {
                    data: {
                        uuid: userId,
                        token,
                    },
                },
            });
        }
    }, [token, activate, userId]);

    if (isSubmitted) {
        return (
            <Page>
                <Message
                    title={strings.activationSuccessMessage}
                />
                <ListView withCenteredContents>
                    <Link
                        to="login"
                        styleVariant="filled"
                    >
                        {strings.goToLogin}
                    </Link>
                </ListView>

            </Page>
        );
    }
    if (isErrored) {
        return (
            <Page>
                <Message
                    title={strings.activationFailMessage}
                />
            </Page>
        );
    }
    return null;
}

Component.displayName = 'Activation';
