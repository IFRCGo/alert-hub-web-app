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
import { isNotDefined } from '@togglecorp/fujs';
import {
    createSubmitHandler,
    getErrorObject,
    getErrorString,
    type ObjectSchema,
    type PartialForm,
    requiredCondition,
    requiredStringCondition,
    useForm,
    useFormObject,
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
query FilteredAdminList($filters:Admin1Filter, $pagination: OffsetPaginationInput) {
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
) {
    private {
        id
        createUserAlertSubcription(data: $data){
            errors
            ok
            result {
                id
                name
                alertFilters
                emailFrequency
                notifyByEmail
                emailFrequencyDisplay
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

type AlertFilterType = ObjectSchema<PartialFormFields['alertFilters']>;
type AlertFilterTypeFields = ReturnType<AlertFilterType['fields']>

type FormSchema = ObjectSchema<PartialFormFields>;
type FormSchemaFields = ReturnType<FormSchema['fields']>

const formSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        name: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        alertFilters: {
            fields: (): AlertFilterTypeFields => ({
                admin1s: {
                    required: true,
                },
                urgency: {
                    required: true,
                },
                certainty: {
                    required: true,
                },
                category: {
                    required: true,
                },
                severity: {
                    required: true,
                },
                country: {
                    required: true,
                },
            }),
        },
        notifyByEmail: {
            required: true,
            requiredValidation: requiredCondition,
        },
        emailFrequency: {
            required: true,
            requiredValidation: requiredCondition,
        },
    }),
};

interface Props {
    subscription?: UserAlertSubscriptionInput;
    onCloseModal: () => void;
}

function NewSubscriptionModal(props: Props) {
    const {
        subscription,
        onCloseModal,
    } = props;

    const strings = useTranslation(i18n);

    const defaultFormValue = useMemo(() => ({
        name: subscription?.name,
        notifyByEmail: subscription?.notifyByEmail,
        emailFrequency: subscription?.emailFrequency,
        alertFilters: {
            urgency: subscription?.alertFilters?.urgency,
            severity: subscription?.alertFilters?.severity,
            certainty: subscription?.alertFilters?.certainty,
            category: subscription?.alertFilters?.category,
            country: subscription?.alertFilters?.country,
            admin1s: subscription?.alertFilters?.admin1s,
        },
    }), [
        subscription,
    ]);

    const {
        value,
        setFieldValue,
        error: formError,
        setError,
        validate,
    } = useForm(formSchema, { value: defaultFormValue });

    const fieldError = getErrorObject(formError);

    const filterError = getErrorObject(fieldError?.alertFilters);

    const alert = useAlert();

    const setAlertFilterValue = useFormObject<'alertFilters', NonNullable<PartialFormFields['alertFilters']>>(
        'alertFilters' as const,
        setFieldValue,
        {},
    );

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
                const response = res.private.createUserAlertSubcription;
                if (!response) {
                    return;
                }
                if (response.ok) {
                    alert.show(
                        strings.newSubscriptionCreatedSucessfully,
                        { variant: 'success' },
                    );
                    onCloseModal();
                } else {
                    alert.show(
                        strings.newSubscriptionFailed,
                        { variant: 'danger' },
                    );
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

    const {
        data: alertEnumsResponse,
    } = useQuery<AlertEnumsAndAllCountriesQuery, AlertEnumsAndAllCountriesQueryVariables>(
        ALERT_ENUMS_AND_ALL_COUNTIES,
    );

    const adminQueryVariables = useMemo<FilteredAdminListQueryVariables>(
        () => {
            if (isNotDefined(value.alertFilters?.country)) {
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
                    country: { pk: value.alertFilters.country },
                },
                // FIXME: Implement search select input
                pagination: {
                    offset: 0,
                    limit: 500,
                },
            };
        },
        [value.alertFilters?.country],
    );

    const {
        data: adminResponse,
    } = useQuery<FilteredAdminListQuery, FilteredAdminListQueryVariables>(
        ADMIN_LIST,
        { variables: adminQueryVariables, skip: isNotDefined(value.alertFilters?.country) },
    );

    const subscriptionCreate = useCallback(() => {
        const handler = createSubmitHandler(
            validate,
            setError,
            (val) => {
                createAlertSubscription({
                    variables: {
                        data: val as UserAlertSubscriptionInput,
                    },
                });
            },
        );
        handler();
    }, [
        setError,
        createAlertSubscription,
        validate,
    ]);

    const handleFormSubmit = createSubmitHandler(validate, setError, subscriptionCreate);

    return (
        <Modal
            className={styles.subscriptionModal}
            heading={strings.newSubscriptionHeading}
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
                    name="urgency"
                    options={alertEnumsResponse?.enums.AlertInfoUrgency}
                    keySelector={urgencyKeySelector}
                    labelSelector={urgencyLabelSelector}
                    value={value.alertFilters?.urgency}
                    onChange={setAlertFilterValue}
                    error={filterError?.urgency}
                    withAsterisk
                />
                <MultiSelectInput
                    label={strings.filterSeverityLabel}
                    placeholder={strings.filterSeverityPlaceholder}
                    name="severity"
                    options={alertEnumsResponse?.enums.AlertInfoSeverity}
                    keySelector={severityKeySelector}
                    labelSelector={severityLabelSelector}
                    value={value.alertFilters?.severity}
                    onChange={setAlertFilterValue}
                    error={filterError?.severity}
                    withAsterisk
                />
                <MultiSelectInput
                    label={strings.filterCertaintyLabel}
                    placeholder={strings.filterCertaintyPlaceholder}
                    name="certainty"
                    options={alertEnumsResponse?.enums.AlertInfoCertainty}
                    keySelector={certaintyKeySelector}
                    labelSelector={certaintyLabelSelector}
                    value={value.alertFilters?.certainty}
                    onChange={setAlertFilterValue}
                    error={filterError?.certainty}
                    withAsterisk
                />
                <MultiSelectInput
                    label={strings.filterCategoryLabel}
                    placeholder={strings.filterCategoryPlaceholder}
                    name="category"
                    options={alertEnumsResponse?.enums.AlertInfoCategory}
                    keySelector={categoryKeySelector}
                    labelSelector={categoryLabelSelector}
                    value={value.alertFilters?.category}
                    onChange={setAlertFilterValue}
                    error={filterError?.category}
                    withAsterisk
                />
                <SelectInput
                    label={strings.filterCountriesLabel}
                    placeholder={strings.filterCountriesPlaceholder}
                    name="country"
                    options={alertEnumsResponse?.public.allCountries}
                    keySelector={stringIdSelector}
                    labelSelector={stringNameSelector}
                    value={value.alertFilters?.country}
                    onChange={setAlertFilterValue}
                    error={filterError?.country}
                    withAsterisk
                />
                <MultiSelectInput
                    label={strings.filterAdmin1Label}
                    placeholder={strings.filterAdmin1Placeholder}
                    name="admin1s"
                    disabled={isNotDefined(value.alertFilters?.country)}
                    options={adminResponse?.public.admin1s.items}
                    keySelector={adminKeySelector}
                    labelSelector={stringNameSelector}
                    value={value.alertFilters?.admin1s}
                    onChange={setAlertFilterValue}
                    error={getErrorString(filterError?.admin1s)}
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
                disabled={isNotDefined(value.notifyByEmail)}
                error={fieldError?.emailFrequency}
            />
        </Modal>
    );
}

export default NewSubscriptionModal;
