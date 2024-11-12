import {
    Button,
    PasswordInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { isTruthyString } from '@togglecorp/fujs';
import {
    addCondition,
    createSubmitHandler,
    getErrorObject,
    type ObjectSchema,
    requiredStringCondition,
    undefinedValue,
    useForm,
} from '@togglecorp/toggle-form';

import Page from '#components/Page';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface FormFields {
    new_password?: string;
    confirmPassword?: string;
}

const defaultFormValue: FormFields = {
};

type FormSchema = ObjectSchema<FormFields>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

function getPasswordMatchCondition(referenceVal: string | undefined) {
    function passwordMatchCondition(val: string | undefined) {
        if (isTruthyString(val) && isTruthyString(referenceVal) && val !== referenceVal) {
            return 'Passwords do not match';
        }
        return undefined;
    }

    return passwordMatchCondition;
}

const formSchema: FormSchema = {
    fields: (value): FormSchemaFields => {
        let baseSchema = {
            new_password: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
        };
        baseSchema = addCondition(
            baseSchema,
            value,
            ['new_password'],
            ['confirmPassword'],
            (val) => ({
                confirmPassword: {
                    required: true,
                    requiredValidation: requiredStringCondition,
                    forceValue: undefinedValue,
                    validations: [getPasswordMatchCondition(val?.new_password)],
                },
            }),
        );

        return baseSchema;
    },
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

    const handleFormSubmit = createSubmitHandler(
        validate,
        setError,
        // FIXME: Add handleChange logic here
        () => {},
    );

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
                <PasswordInput
                    name="new_password"
                    label={strings.newPassword}
                    value={formValue.new_password}
                    onChange={setFieldValue}
                    error={fieldError?.new_password}
                    withAsterisk
                    autoFocus
                />
                <PasswordInput
                    name="confirmPassword"
                    label={strings.confrimPassword}
                    value={formValue.confirmPassword}
                    onChange={setFieldValue}
                    error={fieldError?.confirmPassword}
                    withAsterisk
                />
                <Button
                    name={undefined}
                    type="submit"
                    className={styles.submitButton}
                >
                    {strings.submitButtonLabel}
                </Button>
            </form>
        </Page>
    );
}

Component.displayName = 'RecoverAccountConfirm';
