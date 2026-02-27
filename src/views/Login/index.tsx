import {
    useCallback,
    useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    Button,
    Container,
    InlineLayout,
    ListView,
    PasswordInput,
    TextInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { resolveToComponent } from '@ifrc-go/ui/utils';
import { isDefined } from '@togglecorp/fujs';
import {
    createSubmitHandler,
    emailCondition,
    getErrorObject,
    lengthGreaterThanCondition,
    lengthSmallerThanCondition,
    type ObjectSchema,
    PartialForm,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';

import Link from '#components/Link';
import Page from '#components/Page';
import UserContext from '#contexts/user';
import {
    LoginMutation,
    LoginMutationVariables,
    UserLoginInput,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';

import i18n from './i18n.json';

const LOGIN = gql`
    mutation Login($data: UserLoginInput!) {
        public {
            login(data: $data) {
                ok
                errors
                result {
                    id
                    displayName
                    firstName
                    email
                    lastName
                }
            }
        }
    }
`;

type FormType = PartialForm<UserLoginInput>;
type FormSchema = ObjectSchema<FormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const formSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        email: {
            required: true,
            validations: [
                emailCondition,
            ],
            requiredValidation: requiredStringCondition,
        },
        password: {
            required: true,
            validations: [
                lengthGreaterThanCondition(4),
                lengthSmallerThanCondition(129),
            ],
            requiredValidation: requiredStringCondition,
        },
    }),
};

const defaultFormValue: FormType = {};

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    const alert = useAlert();
    const navigate = useNavigate();
    const { setUserAuth: setUser } = useContext(UserContext);

    const {
        pristine,
        value: formValue,
        setFieldValue,
        error,
        setError,
        validate,
    } = useForm(formSchema, { value: defaultFormValue });

    const fieldError = getErrorObject(error);

    const [
        triggerLogin,
        { loading: loginPending },
    ] = useMutation<LoginMutation, LoginMutationVariables>(
        LOGIN,
        {
            onCompleted: (loginResponse) => {
                const response = loginResponse?.public?.login;
                if (!response) {
                    return;
                }

                if (response.ok) {
                    setUser({
                        firstName: response.result?.firstName,
                        lastName: response.result?.lastName,
                        displayName: response.result?.displayName,
                        email: response.result?.email,
                    });
                    alert.show(
                        strings.loginSuccessfully,
                        { variant: 'success' },
                    );
                    navigate('/');
                } else {
                    const errorMessages = response?.errors
                        ?.map((errors: { messages: string; }) => errors.messages)
                        .filter(isDefined)
                        .join(', ');
                    alert.show(errorMessages, { variant: 'danger' });
                }
            },
            onError: () => {
                alert.show(
                    strings.loginFailureMessage,
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleFormSubmit = useCallback(() => {
        const handler = createSubmitHandler(
            validate,
            setError,
            (val) => {
                triggerLogin({
                    variables: {
                        data: val as UserLoginInput,
                    },
                });
            },
        );
        handler();
    }, [
        setError,
        triggerLogin,
        validate,
    ]);

    const registerInfo = resolveToComponent(
        strings.loginDontHaveAccount,
        {
            registerLink: (
                <Link
                    to="register"
                    withUnderline
                >
                    {strings.loginRegister}
                </Link>
            ),
        },
    );

    return (
        <Page
            title={strings.loginTitle}
            heading={strings.loginHeader}
            description={strings.loginSubHeader}
        >
            <form onSubmit={handleFormSubmit}>
                <Container
                    pending={loginPending}
                    spacing="lg"
                    withCenteredContent
                    withPadding
                >
                    <ListView
                        layout="block"
                        spacing="xl"
                    >

                        <ListView
                            layout="block"
                            spacing="xl"
                        >
                            <TextInput
                                name="email"
                                label={strings.loginEmailUsername}
                                value={formValue.email}
                                error={fieldError?.email}
                                onChange={setFieldValue}
                                withAsterisk
                                autoFocus
                            />
                            <PasswordInput
                                name="password"
                                label={strings.loginPassword}
                                value={formValue.password}
                                error={fieldError?.password}
                                onChange={setFieldValue}
                                withAsterisk
                            />
                        </ListView>
                        <InlineLayout
                            after={(
                                <Link
                                    to="recoverAccount"
                                    title={strings.loginRecoverTitle}
                                    withUnderline
                                >
                                    {strings.loginForgotUserPass}
                                </Link>
                            )}

                        >
                            {/* <Link
                                to="resendValidationEmail"
                                title={strings.loginResendValidationTitle}
                                withUnderline
                            >
                                {strings.loginResendValidation}
                            </Link> */}
                        </InlineLayout>
                        <ListView
                            layout="block"
                            withCenteredContents
                        >
                            <Button
                                name={undefined}
                                type="submit"
                                onClick={handleFormSubmit}
                                disabled={pristine || loginPending}
                                styleVariant="filled"
                            >
                                {strings.loginButton}
                            </Button>
                            <div>
                                {registerInfo}
                            </div>
                        </ListView>
                    </ListView>
                </Container>
            </form>
        </Page>
    );
}

Component.displayName = 'Login';
