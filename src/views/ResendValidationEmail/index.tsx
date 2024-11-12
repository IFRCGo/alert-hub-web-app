import { useMemo } from 'react';
import {
    Button,
    TextInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    createSubmitHandler,
    getErrorObject,
    type ObjectSchema,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';

import HCaptcha from '#components/Captcha';
import Page from '#components/Page';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface FormFields {
    email?: string;
    captcha?:string;
}

const defaultFormValue: FormFields = {
};

type FormSchema = ObjectSchema<FormFields>;
type FormSchemaFields = ReturnType<FormSchema['fields']>

const formSchema: FormSchema = {
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

    const {
        value: formValue,
        error: formError,
        setFieldValue,
        setError,
        validate,
    } = useForm(formSchema, { value: defaultFormValue });

    const handleFormSubmit = useMemo(
        () => createSubmitHandler(
            validate,
            setError,
            // FIXME: Add Submit logic here
            () => {},
        ),
        [validate, setError],
    );

    const fieldError = getErrorObject(formError);

    return (
        <Page
            className={styles.resendValidationEmail}
            title={strings.pageTitle}
            heading={strings.pageHeading}
            description={strings.pageDescription}
        >
            <form
                className={styles.form}
                onSubmit={handleFormSubmit}
            >

                <TextInput
                    name="email"
                    label={strings.emailInputLabel}
                    value={formValue.email}
                    onChange={setFieldValue}
                    error={fieldError?.email}
                    disabled={false}
                    withAsterisk
                    autoFocus
                />
                <div className={styles.actions}>
                    <HCaptcha
                        name="captcha"
                        onChange={setFieldValue}
                    />
                    <Button
                        name={undefined}
                        type="submit"
                        className={styles.submitButton}
                        disabled={false}
                    >
                        {strings.submitButtonLabel}
                    </Button>
                </div>

            </form>
        </Page>
    );
}

Component.displayName = 'ResendValidationEmail';
