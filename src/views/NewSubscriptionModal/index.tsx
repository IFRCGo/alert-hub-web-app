import {
    useCallback,
    useMemo,
} from 'react';
import {
    gql,
    useMutation,
    useQuery,
} from '@apollo/client';
import {
    Button,
    Checkbox,
    Modal,
    MultiSelectInput,
    RadioInput,
    SelectInput,
    TextInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';
import {
    createSubmitHandler,
    getErrorObject,
    getErrorString,
    type ObjectSchema,
    type PartialForm,
    requiredCondition,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';

import {
    AlertEnumsAndAllCountriesQuery,
    AlertEnumsAndAllCountriesQueryVariables,
    AlertEnumsQuery,
    AppEnumCollection,
    CreateUserAlertSubscriptionMutation,
    CreateUserAlertSubscriptionMutationVariables,
    FilteredAdminListQuery,
    FilteredAdminListQueryVariables,
    UpdateSubscriptionMutation,
    UpdateSubscriptionMutationVariables,
    UserAlertSubscriptionEmailFrequencyEnum,
    UserAlertSubscriptionInput,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import {
    stringIdSelector,
    stringNameSelector,
} from '#utils/selectors';

import i18n from './i18n.json';
import styles from './styles.module.css';

const ALERT_ENUMS_AND_ALL_COUNTIES = gql`
query AlertEnumsAndAllCountries {
    enums {
        AlertInfoCertainty {
            key
            label
        }
        AlertInfoUrgency {
            key
            label
        }
        AlertInfoSeverity {
            key
            label
        }
        AlertInfoCategory {
            key
            label
        }
        UserAlertSubscriptionEmailFrequency {
            key
            label
        }
    }
    public {
        id
        allCountries {
            name
            id
        }
    }
}
`;

const ADMIN_LIST = gql`
query FilteredAdminList($filters: Admin1Filter, $pagination: OffsetPaginationInput) {
    public {
        id
        admin1s(filters: $filters, pagination: $pagination) {
            items {
                id
                name
                countryId
                alertCount
            }
        }
    }
}
`;

const CREATE_USER_ALERT_SUBSCRIPTION = gql`
mutation CreateUserAlertSubscription(
    $data: UserAlertSubscriptionInput!,
    $filter: AlertFilter,
) {
    private {
        createUserAlertSubscription(
            data: $data,
        ) {
            ok
            errors
            result {
                id
                name
                notifyByEmail
                isActive
                filterAlertUrgencies
                filterAlertSeverities
                filterAlertCountryId
                filterAlertCountry {
                    id
                    name
                }
                filterAlertCertainties
                filterAlertCategories
                filterAlertAdmin1sDisplay {
                    id
                    name
                    countryId
                }
                filterAlertAdmin1s
                emailLastSentAt
                emailFrequency
                alerts (filters: $filter) {
                    count
                }
            }
        }
        id
    }
}
`;

const UPDATE_SUBSCRIPTION = gql`
    mutation UpdateSubscription (
        $subscriptionId: ID!,
        $data: UserAlertSubscriptionInput!,
    ) {
        private {
            updateUserAlertSubscription(
                id: $subscriptionId,
                data: $data,
            ) {
                errors
                ok
                result {
                    id
                    name
                    notifyByEmail
                    isActive
                    filterAlertUrgencies
                    filterAlertSeverities
                    filterAlertCountryId
                    filterAlertCountry {
                        id
                        name
                    }
                    filterAlertCertainties
                    filterAlertCategories
                    filterAlertAdmin1sDisplay {
                        id
                        name
                        countryId
                    }
                    filterAlertAdmin1s
                    emailLastSentAt
                    emailFrequency
                    alerts {
                        count
                    }
                }
            }
        }
    }
`;

type AdminOption = NonNullable<NonNullable<NonNullable<FilteredAdminListQuery['public']>['admin1s']>['items']>[number];

type Urgency = NonNullable<AlertEnumsQuery['enums']['AlertInfoUrgency']>[number];
type Severity = NonNullable<AlertEnumsQuery['enums']['AlertInfoSeverity']>[number];
type Certainty = NonNullable<AlertEnumsQuery['enums']['AlertInfoCertainty']>[number];
type Category = NonNullable<AlertEnumsQuery['enums']['AlertInfoCategory']>[number];

type EmailFrequency = NonNullable<AppEnumCollection['UserAlertSubscriptionEmailFrequency']>[number];

const adminKeySelector = (admin1: AdminOption) => admin1.id;
const urgencyKeySelector = (urgency: Urgency) => urgency.key;
const urgencyLabelSelector = (urgency: Urgency) => urgency.label;

const severityKeySelector = (severity: Severity) => severity.key;
const severityLabelSelector = (severity: Severity) => severity.label;

const certaintyKeySelector = (certainty: Certainty) => certainty.key;
const certaintyLabelSelector = (certainty: Certainty) => certainty.label;

const frequencyKeySelector = (frequency: EmailFrequency) => frequency.key;
const frequencyLabelSelector = (frequency: EmailFrequency) => frequency.label;

const categoryKeySelector = (category: Category) => category.key;
const categoryLabelSelector = (category: Category) => category.label;

type PartialFormFields = PartialForm<UserAlertSubscriptionInput>;

type FormSchema = ObjectSchema<PartialFormFields>;
const formSchema: FormSchema = {
    fields: (value) => ({
        name: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        filterAlertUrgencies: {
            defaultValue: [],
        },
        filterAlertCertainties: {
            defaultValue: [],
        },
        filterAlertSeverities: {
            defaultValue: [],
        },
        filterAlertCategories: {
            defaultValue: [],
        },
        filterAlertCountry: {
            required: true,
        },
        filterAlertAdmin1s: {
            required: true,
        },
        notifyByEmail: {
            required: true,
        },
        emailFrequency: {
            required: !!value?.notifyByEmail,
            requiredValidation: value?.notifyByEmail ? requiredCondition : undefined,
        },
    }),
};

interface Props {
    subscription?: { id?: string } & Partial<UserAlertSubscriptionInput>;
    onCloseModal: () => void;
    onSuccess: (() => void) | undefined;
}

function NewSubscriptionModal(props: Props) {
    const {
        subscription,
        onCloseModal,
        onSuccess,
    } = props;

    const strings = useTranslation(i18n);

    const defaultFormValue = useMemo(() => ({
        id: subscription?.id,
        name: subscription?.name,
        filterAlertUrgencies: subscription?.filterAlertUrgencies
            ?? [],
        filterAlertCertainties: subscription?.filterAlertCertainties
            ?? [],
        filterAlertSeverities: subscription?.filterAlertSeverities
            ?? [],
        filterAlertCategories: subscription?.filterAlertCategories
            ?? [],
        filterAlertCountry: subscription?.filterAlertCountry,
        filterAlertAdmin1s: subscription?.filterAlertAdmin1s
            ?? [],
        notifyByEmail: subscription?.notifyByEmail ?? false,
        emailFrequency: subscription?.emailFrequency
            ?? UserAlertSubscriptionEmailFrequencyEnum.Monthly,
    }), [subscription]);

    const {
        value,
        setFieldValue,
        error: formError,
        setError,
        validate,
    } = useForm(formSchema, { value: defaultFormValue });

    const fieldError = getErrorObject(formError);

    const alert = useAlert();

    const [
        createAlertSubscription,
        { loading: loadingSubscription },
    ] = useMutation<
        CreateUserAlertSubscriptionMutation,
        CreateUserAlertSubscriptionMutationVariables
    >(
        CREATE_USER_ALERT_SUBSCRIPTION,
        {
            onCompleted: (res) => {
                const response = res.private.createUserAlertSubscription;
                if (!response) {
                    return;
                }

                if (response.ok) {
                    onCloseModal();
                    alert.show(
                        strings.newSubscriptionCreatedSuccessfully,
                        { variant: 'success' },
                    );
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    const errorMessages = response?.errors
                        ?.map((error: { messages: string; }) => error.messages)
                        .filter((message: string) => message)
                        .join(', ');
                    alert.show(errorMessages, { variant: 'danger' });
                }
            },
            onError: () => {
                alert.show(
                    strings.newSubscriptionFailed,
                    { variant: 'danger' },
                );
            },
        },
    );

    const [
        triggerSubscriptionUpdate,
    ] = useMutation<UpdateSubscriptionMutation, UpdateSubscriptionMutationVariables>(
        UPDATE_SUBSCRIPTION,
        {
            onCompleted: (projectResponse) => {
                const response = projectResponse?.private?.updateUserAlertSubscription;
                if (!response) {
                    return;
                }
                if (response.ok) {
                    alert.show(
                        strings.subscriptionUpdatedSuccessfully,
                        { variant: 'success' },
                    );
                    onCloseModal();
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    const errorMessages = response?.errors
                        ?.map((error: { messages: string; }) => error.messages)
                        .filter((message: string) => message)
                        .join(', ');
                    alert.show(errorMessages, { variant: 'danger' });
                }
            },
            onError: () => {
                alert.show(
                    strings.failedToUpdateSubscription,
                    { variant: 'danger' },
                );
            },
        },
    );

    const {
        data: alertEnumsResponse,
    } = useQuery<AlertEnumsAndAllCountriesQuery, AlertEnumsAndAllCountriesQueryVariables>(
        ALERT_ENUMS_AND_ALL_COUNTIES,
    );

    const adminQueryVariables = useMemo<FilteredAdminListQueryVariables>(
        () => {
            if (isNotDefined(value.filterAlertCountry)) {
                return {
                    filters: undefined,
                    // FIXME: Implement search select input
                    pagination: {
                        offset: 0,
                        limit: 500,
                    },
                };
            }

            return {
                filters: {
                    country: { pk: value.filterAlertCountry },
                },
                // FIXME: Implement search select input
                pagination: {
                    offset: 0,
                    limit: 500,
                },
            };
        },
        [value.filterAlertCountry],
    );

    const {
        data: adminResponse,
    } = useQuery<FilteredAdminListQuery, FilteredAdminListQueryVariables>(
        ADMIN_LIST,
        { variables: adminQueryVariables, skip: isNotDefined(value.filterAlertCountry) },
    );

    const subscriptionCreate = useCallback(() => {
        const handler = createSubmitHandler(
            validate,
            setError,
            (val) => {
                if (subscription?.id) {
                    triggerSubscriptionUpdate({
                        variables: {
                            subscriptionId: subscription.id,
                            data: val as UserAlertSubscriptionInput,
                        },
                    }).then(() => {
                        if (onSuccess) {
                            onSuccess();
                        }
                    });
                } else {
                    createAlertSubscription({
                        variables: {
                            data: {
                                ...val as UserAlertSubscriptionInput,
                                isActive: true,
                            },
                        },
                    });
                }
            },
        );
        handler();
    }, [
        setError,
        subscription?.id,
        triggerSubscriptionUpdate,
        createAlertSubscription,
        validate,
        onSuccess,
    ]);

    const handleFormSubmit = createSubmitHandler(validate, setError, subscriptionCreate);

    return (
        <Modal
            className={styles.subscriptionModal}
            heading={(isDefined(subscription?.id)
                ? strings.editSubscriptionHeading : strings.newSubscriptionHeading
            )}
            footerContent={(
                <Button
                    name={undefined}
                    onClick={handleFormSubmit}
                    disabled={isNotDefined(value.name) && loadingSubscription}
                >
                    {strings.createNewSubscription}
                </Button>
            )}
            footerContentClassName={styles.createButton}
            contentViewType="vertical"
            spacing="comfortable"
            onClose={onCloseModal}
        >
            <TextInput
                name="name"
                label={strings.newSubscriptionTitle}
                value={value.name}
                error={fieldError?.name}
                onChange={setFieldValue}
                withAsterisk
            />
            <div className={styles.filters}>
                <MultiSelectInput
                    label={strings.filterUrgencyLabel}
                    placeholder={strings.filterUrgencyPlaceholder}
                    name="filterAlertUrgencies"
                    options={alertEnumsResponse?.enums.AlertInfoUrgency}
                    keySelector={urgencyKeySelector}
                    labelSelector={urgencyLabelSelector}
                    value={value.filterAlertUrgencies}
                    onChange={setFieldValue}
                    error={fieldError?.filterAlertUrgencies}
                />
                <MultiSelectInput
                    label={strings.filterSeverityLabel}
                    placeholder={strings.filterSeverityPlaceholder}
                    name="filterAlertSeverities"
                    options={alertEnumsResponse?.enums.AlertInfoSeverity}
                    keySelector={severityKeySelector}
                    labelSelector={severityLabelSelector}
                    value={value.filterAlertSeverities}
                    onChange={setFieldValue}
                    error={fieldError?.filterAlertSeverities}
                />
                <MultiSelectInput
                    label={strings.filterCertaintyLabel}
                    placeholder={strings.filterCertaintyPlaceholder}
                    name="filterAlertCertainties"
                    options={alertEnumsResponse?.enums.AlertInfoCertainty}
                    keySelector={certaintyKeySelector}
                    labelSelector={certaintyLabelSelector}
                    value={value.filterAlertCertainties}
                    onChange={setFieldValue}
                    error={fieldError?.filterAlertCertainties}
                />
                <MultiSelectInput
                    label={strings.filterCategoryLabel}
                    placeholder={strings.filterCategoryPlaceholder}
                    name="filterAlertCategories"
                    options={alertEnumsResponse?.enums.AlertInfoCategory}
                    keySelector={categoryKeySelector}
                    labelSelector={categoryLabelSelector}
                    value={value.filterAlertCategories}
                    onChange={setFieldValue}
                    error={fieldError?.filterAlertCategories}
                />
                <SelectInput
                    label={strings.filterCountriesLabel}
                    placeholder={strings.filterCountriesPlaceholder}
                    name="filterAlertCountry"
                    options={alertEnumsResponse?.public.allCountries}
                    keySelector={stringIdSelector}
                    labelSelector={stringNameSelector}
                    value={value.filterAlertCountry}
                    onChange={setFieldValue}
                    error={fieldError?.filterAlertCountry}
                    withAsterisk
                />
                <MultiSelectInput
                    label={strings.filterAdmin1Label}
                    placeholder={strings.filterAdmin1Placeholder}
                    name="filterAlertAdmin1s"
                    disabled={isNotDefined(value.filterAlertCountry)}
                    options={adminResponse?.public.admin1s.items}
                    keySelector={adminKeySelector}
                    labelSelector={stringNameSelector}
                    value={value.filterAlertAdmin1s}
                    onChange={setFieldValue}
                    error={getErrorString(fieldError?.filterAlertAdmin1s)}
                    withAsterisk
                />
            </div>
            <Checkbox
                label={strings.sendViaEmailLabel}
                name="notifyByEmail"
                value={value.notifyByEmail}
                error={fieldError?.notifyByEmail}
                onChange={setFieldValue}
            />
            <RadioInput
                name="emailFrequency"
                options={alertEnumsResponse?.enums?.UserAlertSubscriptionEmailFrequency}
                keySelector={frequencyKeySelector}
                labelSelector={frequencyLabelSelector}
                value={value?.emailFrequency}
                onChange={setFieldValue}
                disabled={!value.notifyByEmail}
                error={fieldError?.emailFrequency}
            />
        </Modal>
    );
}

export default NewSubscriptionModal;
