import { useCallback } from 'react';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    Button,
    ListView,
    PasswordInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    isDefined,
    isTruthyString,
} from '@togglecorp/fujs';
import {
    addCondition,
    createSubmitHandler,
    getErrorObject,
    type ObjectSchema,
    requiredStringCondition,
    undefinedValue,
    useForm,
} from '@togglecorp/toggle-form';

import HCaptcha from '#components/Captcha';
import NonFieldError from '#components/NonFiledError';
import Page from '#components/Page';
import {
    PasswordResetConfirmMutation,
    PasswordResetConfirmMutationVariables,
    UserPasswordResetConfirmInput,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import { transformToFormError } from '#utils/errorTransform';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface FormFields {
    newPassword?: string;
    confirmPassword?: string;
    captcha?: string;
}

const PASSWORD_RESET_CONFIRM_MUTATION = gql`
    mutation PasswordResetConfirm($data: UserPasswordResetConfirmInput!) {
        public {
            passwordResetConfirm(data: $data) {
                errors
                ok
            }
        }
    }
`;

type FormType = Partial<UserPasswordResetConfirmInput & { confirmPassword: string }>;
type FormSchema = ObjectSchema<FormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

function getPasswordMatchCondition(referenceVal: string | undefined) {
    return (val: string | undefined) => {
        if (isTruthyString(val) && isTruthyString(referenceVal) && val !== referenceVal) {
            return 'Passwords do not match';
        }
        return undefined;
    };
}

const formSchema: FormSchema = {
    fields: (value): FormSchemaFields => {
        let baseSchema = {
            newPassword: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
            confirmPassword: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
            captcha: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
        } as FormSchemaFields;

        baseSchema = addCondition(
            baseSchema,
            value,
            ['newPassword'],
            ['confirmPassword'],
            (val) => ({
                confirmPassword: {
                    required: true,
                    requiredValidation: requiredStringCondition,
                    forceValue: undefinedValue,
                    validations: [getPasswordMatchCondition(val?.newPassword)],
                },
            }),
        );

        return baseSchema;
    },
};

const defaultFormValue: FormFields = {};

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { userId, resetToken } = useParams<{ userId?: string, resetToken?: string }>();
    const strings = useTranslation(i18n);
    const navigate = useNavigate();
    const alert = useAlert();
    const {
        value: formValue,
        error: formError,
        setFieldValue,
        setError,
        validate,
    } = useForm(formSchema, { value: defaultFormValue });

    const [passwordResetConfirm, { loading }] = useMutation<
        PasswordResetConfirmMutation,
        PasswordResetConfirmMutationVariables
    >(PASSWORD_RESET_CONFIRM_MUTATION, {
        onCompleted: (data) => {
            if (data.public.passwordResetConfirm.ok) {
                alert.show(
                    strings.successfulMessageTitle,
                    {
                        description: strings.successfulMessageDescription,
                        variant: 'success',
                    },
                );
                navigate('/login');
            } else {
                setError(transformToFormError(
                    data.public.passwordResetConfirm.errors,
                ));
                const errorMessages = data.public.passwordResetConfirm?.errors
                    ?.map((error: { messages: string; }) => error.messages)
                    .filter(isDefined)
                    .join(', ');
                alert.show(errorMessages, { variant: 'danger' });
            }
        },
        onError: () => {
            alert.show(
                strings.failureMessageTitle,
                { variant: 'danger' },
            );
        },
    });
    const handleChangePassword = useCallback(
        (formValues: FormFields) => {
            if (!userId) {
                alert.show(
                    strings.uuidMissingMessage,
                    { variant: 'warning' },
                );
                return;
            }
            if (!resetToken) {
                alert.show(
                    strings.tokenMissingMessage,
                    { variant: 'warning' },
                );
                return;
            }
            passwordResetConfirm({
                variables: {
                    data: {
                        newPassword: formValues.newPassword,
                        captcha: formValues.captcha,
                        token: resetToken,
                        uuid: userId,
                    } as UserPasswordResetConfirmInput,
                },
            });
        },
        [passwordResetConfirm, userId, resetToken, alert, strings],
    );

    const onCaptchaError = useCallback((errorString: string) => {
        setError((oldErrors) => {
            const fieldErrors = getErrorObject(oldErrors);
            return ({
                ...fieldErrors,
                captcha: errorString,
            });
        });
    }, [setError]);

    const handleFormSubmit = createSubmitHandler(validate, setError, handleChangePassword);

    const fieldError = getErrorObject(formError);

    return (
        <Page
            className={styles.recoverAccountConfirm}
            title={strings.pageTitle}
            heading={strings.pageHeading}
        >
            <form
                className={styles.form}
                onSubmit={handleFormSubmit}
            >
                <NonFieldError
                    error={formError}
                    withFallbackError
                />
                <PasswordInput
                    name="newPassword"
                    label={strings.newPassword}
                    value={formValue.newPassword}
                    onChange={setFieldValue}
                    error={fieldError?.newPassword}
                    disabled={loading}
                    withAsterisk
                    autoFocus
                />
                <PasswordInput
                    name="confirmPassword"
                    label={strings.confirmPassword}
                    value={formValue.confirmPassword}
                    onChange={setFieldValue}
                    error={fieldError?.confirmPassword}
                    disabled={loading}
                    withAsterisk
                />
                <ListView
                    layout="block"
                    withCenteredContents
                >
                    <HCaptcha
                        name="captcha"
                        onChange={setFieldValue}
                        onError={onCaptchaError}
                        error={fieldError?.captcha}
                    />
                    <Button
                        name={undefined}
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                        styleVariant="filled"
                        colorVariant="primary"
                    >
                        {strings.submitButtonLabel}
                    </Button>
                </ListView>
            </form>
        </Page>
    );
}

Component.displayName = 'RecoverAccountConfirm';
