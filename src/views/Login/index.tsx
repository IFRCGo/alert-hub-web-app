import { useMemo } from 'react';
import {
    Button,
    PasswordInput,
    TextInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { resolveToComponent } from '@ifrc-go/ui/utils';
import {
    createSubmitHandler,
    type ObjectSchema,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';

import HCaptcha from '#components/Captcha';
import Link from '#components/Link';
import Page from '#components/Page';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface FormFields {
    email: string;
    password: string;
    captcha: string;
}
type PartialFormFields = Partial<FormFields>;
type FormSchema = ObjectSchema<PartialFormFields>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const defaultFormValue: PartialFormFields = {};

const formSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        email: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        password: {
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
    const {
        value: formValue,
        setFieldValue,
        setError,
        validate,
    } = useForm(formSchema, { value: defaultFormValue });

    const fieldError: PartialFormFields = {};

    const handleFormSubmit = useMemo(
        () => createSubmitHandler(
            validate,
            setError,
            // FIXME: Add form submission logic here
            () => {},
        ),
        [validate, setError],
    );

    const signupInfo = resolveToComponent(
        strings.loginDontHaveAccount,
        {
            signUpLink: (
                <Link
                    to="login" // FIXME :add Register
                    withUnderline
                >
                    {strings.loginSignUp}
                </Link>
            ),
        },
    );

    return (
        <Page
            className={styles.login}
            title={strings.loginTitle}
            heading={strings.loginHeader}
            description={strings.loginSubHeader}
            mainSectionClassName={styles.mainSection}
        >
            <form
                className={styles.form}
                onSubmit={handleFormSubmit}
            >
                <div className={styles.fields}>
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
                </div>
                <div className={styles.utilityLinks}>
                    <Link
                        to="recoverAccount"
                        title={strings.loginRecoverTitle}
                        withUnderline
                    >
                        {strings.loginForgotUserPass}
                    </Link>
                    <Link
                        to="login" // FIXME :LoginResendValidation
                        title={strings.loginResendValidationTitle}
                        withUnderline
                    >
                        {strings.loginResendValidation}
                    </Link>
                </div>
                <div className={styles.actions}>
                    <HCaptcha
                        name="captcha"
                        onChange={setFieldValue}
                    />
                    <Button
                        name={undefined}
                        type="submit"
                        onClick={handleFormSubmit}
                    >
                        {strings.loginButton}
                    </Button>
                    <div className={styles.signUp}>
                        {signupInfo}
                    </div>
                </div>
            </form>
        </Page>
    );
}

Component.displayName = 'Login';
