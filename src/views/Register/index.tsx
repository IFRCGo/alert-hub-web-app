import {
    useCallback,
    useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    Button,
    TextInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { resolveToComponent } from '@ifrc-go/ui/utils';
import { isTruthyString } from '@togglecorp/fujs';
import {
    addCondition,
    createSubmitHandler,
    emailCondition,
    getErrorObject,
    nonFieldError,
    type ObjectSchema,
    removeNull,
    requiredStringCondition,
    undefinedValue,
    useForm,
} from '@togglecorp/toggle-form';

import HCaptcha from '#components/Captcha';
import Link from '#components/Link';
import NonFieldError from '#components/NonFiledError';
import Page from '#components/Page';
import {
    RegisterMutation,
    RegisterMutationVariables,
    UserRegisterInput,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import { transformToFormError } from '#utils/errorTransform';

import i18n from './i18n.json';
import styles from './styles.module.css';

const REGISTER_MUTATION = gql`
    mutation Register($data: UserRegisterInput!) {
        public {
            register(data: $data){
                errors
                ok
            }
        }
    }
`;

function getPasswordMatchCondition(referenceVal: string | undefined) {
    function passwordMatchCondition(val: string | undefined) {
        if (isTruthyString(val) && isTruthyString(referenceVal) && val !== referenceVal) {
            return 'Passwords do not match';
        }
        return undefined;
    }

    return passwordMatchCondition;
}

type PartialFormFields = Partial<UserRegisterInput & { confirmPassword: string }>;
type FormSchema = ObjectSchema<PartialFormFields>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const formSchema: FormSchema = {
    fields: (value): FormSchemaFields => {
        let fields: FormSchemaFields = {
            firstName: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
            lastName: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
            email: {
                required: true,
                requiredValidation: requiredStringCondition,
                validations: [emailCondition],
            },
            password: {
                required: true,
                requiredValidation: requiredStringCondition,
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
            ['confirmPassword'],
            (val) => ({
                confirmPassword: {
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
    const alert = useAlert();
    const navigate = useNavigate();
    const [formValue] = useState<PartialFormFields>({});
    const {
        value,
        setFieldValue,
        setError,
        validate,
        error: fieldError,
    } = useForm(formSchema, {
        value: formValue,
    });

    const error = getErrorObject(fieldError);
    const [
        triggerRegister,
        {
            loading: registerPending,
        },
    ] = useMutation<RegisterMutation, RegisterMutationVariables>(REGISTER_MUTATION, {
        onCompleted: (response) => {
            const { public: publicRes } = response;
            if (!publicRes) {
                return;
            }
            const { register: registerRes } = publicRes;
            if (!registerRes) {
                return;
            }
            const { errors, ok } = registerRes;

            if (errors) {
                const formError = transformToFormError(removeNull(
                    errors,
                ));
                setError(formError);
            } else if (ok) {
                navigate('/login');
                alert.show(
                    strings.registrationSuccess,
                    { variant: 'success' },
                );
            }
        },
        onError: (errors) => {
            setError({
                [nonFieldError]: errors.message,
            });
            alert.show(
                strings.registrationFailure,
                { variant: 'danger' },
            );
        },
    });

    const handleFormSubmit = createSubmitHandler(
        validate,
        setError,
        (finalValue) => {
            const val = finalValue as UserRegisterInput;
            triggerRegister({
                variables: {
                    data: {
                        captcha: val.captcha,
                        email: val.email,
                        firstName: val.firstName,
                        lastName: val.lastName,
                        password: val.password,
                    },
                },
            });
        },
    );
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

    const onCaptchaError = useCallback((errorString: string) => {
        setError((oldErrors) => {
            const fieldErrors = getErrorObject(oldErrors);
            return ({
                ...fieldErrors,
                captcha: errorString,
            });
        });
    }, [setError]);

    return (
        <Page
            className={styles.register}
            title={strings.registerTitle}
            heading={strings.registerHeader}
            description={strings.registerSubHeader}
            mainSectionClassName={styles.mainSection}
        >
            <div className={styles.form}>
                <NonFieldError error={error} />
                <TextInput
                    name="firstName"
                    label={strings.registerFirstName}
                    value={value.firstName}
                    onChange={setFieldValue}
                    error={error?.firstName}
                    withAsterisk
                />
                <TextInput
                    name="lastName"
                    label={strings.registerLastName}
                    value={value.lastName}
                    onChange={setFieldValue}
                    error={error?.lastName}
                    withAsterisk
                />
                <TextInput
                    name="email"
                    label={strings.registerEmail}
                    value={value.email}
                    onChange={setFieldValue}
                    error={error?.email}
                    withAsterisk
                />
                <TextInput
                    name="password"
                    type="password"
                    label={strings.registerPassword}
                    value={value.password}
                    onChange={setFieldValue}
                    error={error?.password}
                    withAsterisk
                />
                <TextInput
                    name="confirmPassword"
                    type="password"
                    label={strings.registerConfirmPassword}
                    value={value.confirmPassword}
                    onChange={setFieldValue}
                    error={error?.confirmPassword}
                    withAsterisk
                />
            </div>
            <div className={styles.actions}>
                <HCaptcha
                    name="captcha"
                    onChange={setFieldValue}
                    onError={onCaptchaError}
                />
                <Button
                    name={undefined}
                    onClick={handleFormSubmit}
                    disabled={registerPending}
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
