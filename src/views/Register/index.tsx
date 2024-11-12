import { useState } from 'react';
import {
    Button,
    SelectInput,
    TextInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { resolveToComponent } from '@ifrc-go/ui/utils';
import { isTruthyString } from '@togglecorp/fujs';
import {
    addCondition,
    createSubmitHandler,
    emailCondition,
    type ObjectSchema,
    requiredStringCondition,
    undefinedValue,
    useForm,
} from '@togglecorp/toggle-form';

import HCaptcha from '#components/Captcha';
import Link from '#components/Link';
import Page from '#components/Page';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface DefaultFormValue {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    country: string;
    city: string;
    organization: string;
    organization_type: string;
    captcha?:string;
}

function getPasswordMatchCondition(referenceVal: string | undefined) {
    return (val: string | undefined) => (
        isTruthyString(val) && isTruthyString(referenceVal) && val !== referenceVal
            ? 'Passwords do not match'
            : undefined
    );
}

const organizationTypes = [
    { id: '101', key: 'NTLS', value: 'National Society' },
    { id: '102', key: 'NGO', value: 'Non-Governmental Organization' },
    { id: '103', key: 'UN', value: 'United Nations Agency' },
];
const nationalSocietyOptions = [
    { id: '201', society_name: 'Red Cross Society' },
    { id: '202', society_name: 'Red Crescent Society' },
];
const countryOptions = [
    { id: '301', value: 'United States' },
    { id: '302', value: 'Canada' },
    { id: '303', value: 'United Kingdom' },
];
const whitelistedDomains = [
    'example.com',
    'anotherdomain.org',
    'somedomain.net',
];

type FormFields = DefaultFormValue;

const keySelector = (option: { id?: string }): string => option.id || '';
const labelSelector = (option: { value?: string }): string => option.value || '';

type PartialFormFields = Partial<FormFields>;
type FormSchema = ObjectSchema<PartialFormFields>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const isWhitelistedEmail = (email: string): boolean => {
    const domain = email.split('@')[1];
    return whitelistedDomains.includes(domain);
};

const emailWhitelistValidation = (value: string | undefined) => {
    if (!isWhitelistedEmail(value || '')) {
        return 'Email not allowed';
    }
    return undefined;
};

const formSchema: FormSchema = {
    fields: (value): FormSchemaFields => {
        let fields: FormSchemaFields = {
            first_name: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
            last_name: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
            email: {
                required: true,
                requiredValidation: requiredStringCondition,
                validations: [emailCondition, emailWhitelistValidation],
            },
            password: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
            confirm_password: {
                required: true,
                requiredValidation: requiredStringCondition,
                forceValue: undefinedValue,
                validations: [getPasswordMatchCondition(value?.password)],
            },
            captcha: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
        };
        fields = addCondition(
            fields,
            value,
            ['password'],
            ['confirm_password'],
            (val) => ({
                confirm_password: {
                    required: true,
                    requiredValidation: requiredStringCondition,
                    forceValue: undefinedValue,
                    validations: [getPasswordMatchCondition(val?.password)],
                },
            }),
        );

        return fields;
    },
};

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);
    const [formValue] = useState<PartialFormFields>({});

    const {
        value,
        setFieldValue,
        setError,
        validate,
    } = useForm(formSchema, {
        value: formValue,
    });
    const fieldError: PartialFormFields = {};
    const handleFormSubmit = createSubmitHandler(
        validate,
        setError,
        // FIXME: Add Submit logic here
        () => {},
    );
    const isNationalSociety = formValue?.organization_type === 'NTLS';

    const loginInfo = resolveToComponent(strings.registerAccountPresent, {
        loginLink: (
            <Link
                to="login"
                withUnderline
            >
                {strings.registerLogin}
            </Link>
        ),
    });

    return (
        <Page
            className={styles.register}
            title={strings.registerTitle}
            heading={strings.registerHeader}
            description={strings.registerSubHeader}
            mainSectionClassName={styles.mainSection}
        >
            <div className={styles.form}>
                <TextInput
                    name="first_name"
                    label={strings.registerFirstName}
                    value={value.first_name}
                    onChange={setFieldValue}
                    error={fieldError?.first_name}
                    withAsterisk
                />
                <TextInput
                    name="last_name"
                    label={strings.registerLastName}
                    value={value.last_name}
                    onChange={setFieldValue}
                    error={fieldError?.last_name}
                    withAsterisk
                />
                <TextInput
                    className={styles.fullSizeInput}
                    name="email"
                    label={strings.registerEmail}
                    value={value.email}
                    onChange={setFieldValue}
                    error={fieldError?.email}
                    withAsterisk
                />
                <TextInput
                    name="password"
                    type="password"
                    label={strings.registerPassword}
                    value={value.password}
                    onChange={setFieldValue}
                    error={fieldError?.password}
                    withAsterisk
                />
                <TextInput
                    name="confirm_password"
                    type="password"
                    label={strings.registerConfirmPassword}
                    value={value.confirm_password}
                    onChange={setFieldValue}
                    error={fieldError?.confirm_password}
                    withAsterisk
                />
                <div className={styles.formBorder} />
                <SelectInput
                    label={strings.registerOrganizationType}
                    name="organization_type"
                    options={organizationTypes}
                    keySelector={keySelector}
                    labelSelector={labelSelector}
                    value={value.organization_type}
                    onChange={setFieldValue}
                    error={fieldError?.organization_type}
                />
                <SelectInput
                    label={strings.registerCountry}
                    name="country"
                    options={countryOptions}
                    keySelector={keySelector}
                    labelSelector={labelSelector}
                    value={value.country}
                    onChange={setFieldValue}
                    error={fieldError?.country}
                />
                <TextInput
                    name="city"
                    label={strings.registerCity}
                    value={value.city}
                    onChange={setFieldValue}
                    error={fieldError?.city}
                />
                {isNationalSociety ? (
                    <SelectInput
                        label={strings.registerOrganizationName}
                        name="organization"
                        options={nationalSocietyOptions}
                        keySelector={keySelector}
                        labelSelector={keySelector}
                        value={value.organization}
                        onChange={setFieldValue}
                        error={fieldError?.organization}
                    />
                ) : (
                    <TextInput
                        name="organization"
                        label={strings.registerOrganizationName}
                        value={value.organization}
                        onChange={setFieldValue}
                        error={fieldError?.organization}
                    />
                )}
            </div>
            <div className={styles.actions}>
                <HCaptcha
                    name="captcha"
                    onChange={setFieldValue}
                />
                <Button
                    name={undefined}
                    onClick={handleFormSubmit}
                >
                    {strings.registerSubmit}
                </Button>
                <div className={styles.login}>
                    {loginInfo}
                </div>
            </div>
        </Page>
    );
}

Component.displayName = 'Register';
