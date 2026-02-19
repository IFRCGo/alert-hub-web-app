import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    gql,
    useMutation,
} from '@apollo/client';
import { CheckboxFillIcon } from '@ifrc-go/icons';
import {
    Button,
    Message,
    TextInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    createSubmitHandler,
    getErrorObject,
    nonFieldError,
    ObjectSchema,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';

import HCaptcha from '#components/Captcha';
import NonFieldError from '#components/NonFiledError';
import Page from '#components/Page';
import {
    PasswordResetTriggerMutation,
    PasswordResetTriggerMutationVariables,
    UserPasswordResetTriggerInput,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import { transformToFormError } from '#utils/errorTransform';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface FormFields {
    email?: string;
    captcha?: string;
}

const PASSWORD_RECOVERY_MUTATION = gql`
    mutation passwordResetTrigger($data: UserPasswordResetTriggerInput!) {
        public {
            passwordResetTrigger(data: $data) {
                ok
                errors
            }
        }
    }
`;
type FormType = Partial<PasswordResetTriggerMutationVariables['data']>;
type FormSchema = ObjectSchema<FormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const formSchema: ObjectSchema<FormFields> = {
    fields: (): FormSchemaFields => ({
        email: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        captcha: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
    }),
};

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);
    const alert = useAlert();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const defaultFormValue: FormFields = {};
    const {
        value: formValue,
        error: formError,
        setFieldValue,
        setError,
        validate,
    } = useForm(formSchema, { value: defaultFormValue });

    const [
        requestPasswordRecovery,
        { loading },
    ] = useMutation<PasswordResetTriggerMutation, PasswordResetTriggerMutationVariables>(
        PASSWORD_RECOVERY_MUTATION,
        {
            onCompleted: (response) => {
                const {
                    public: { passwordResetTrigger },
                } = response;
                if (passwordResetTrigger?.ok) {
                    setIsSubmitted(true);
                } else if (passwordResetTrigger.errors) {
                    const formErrors = transformToFormError(passwordResetTrigger.errors);
                    setError(formErrors);
                    alert.show(
                        strings.failureMessageTitle,
                        { variant: 'danger' },
                    );
                }
            },
            onError: (error) => {
                setError({ [nonFieldError]: error.message });
                alert.show(
                    strings.failureMessageTitle,
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleFormSubmit = useMemo(
        () => createSubmitHandler(
            validate,
            setError,
            (formValues: FormFields) => {
                requestPasswordRecovery({
                    variables: {
                        data: formValues as UserPasswordResetTriggerInput,
                    },
                });
            },
        ),
        [validate, setError, requestPasswordRecovery],
    );

    const fieldError = getErrorObject(formError);

    const onCaptchaError = useCallback((errorString: string) => {
        setError((oldErrors) => {
            const fieldErrors = getErrorObject(oldErrors);
            return ({
                ...fieldErrors,
                captcha: errorString,
            });
        });
    }, [setError]);

    if (isSubmitted) {
        return (
            <Page>
                <Message
                    icon={<CheckboxFillIcon />}
                    title={strings.successfulMessage}
                />
            </Page>
        );
    }

    return (
        <Page
            title={strings.pageTitle}
            heading={strings.pageHeading}
            description={strings.pageDescription}
            className={styles.recoverAccount}
        >
            <form
                className={styles.form}
                onSubmit={handleFormSubmit}
            >
                <NonFieldError
                    error={formError}
                    withFallbackError
                />
                <TextInput
                    name="email"
                    label={strings.emailInputLabel}
                    value={formValue.email}
                    onChange={setFieldValue}
                    error={fieldError?.email}
                    withAsterisk
                    autoFocus
                />
                <div className={styles.actions}>
                    <HCaptcha
                        name="captcha"
                        onChange={setFieldValue}
                        onError={onCaptchaError}
                        error={fieldError?.captcha}
                    />
                    <Button
                        name={undefined}
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                        styleVariant="filled"
                        colorVariant="primary"
                        textSize="sm"
                    >
                        {strings.submitButtonLabel}
                    </Button>
                </div>
            </form>
        </Page>
    );
}

Component.displayName = 'RecoverAccount';
