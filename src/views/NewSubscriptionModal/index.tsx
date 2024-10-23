import {
    useCallback,
    useMemo,
} from 'react';
import {
    gql,
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
    getErrorObject,
    type ObjectSchema,
    type PartialForm,
    requiredCondition,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';

import {
    AlertEnumsAndAllCountryListQuery,
    AlertEnumsAndAllCountryListQueryVariables,
    AlertEnumsQuery,
    FilteredAdminListQuery,
    FilteredAdminListQueryVariables,
} from '#generated/types/graphql';
import {
    stringIdSelector,
    stringNameSelector,
} from '#utils/selectors';
import {
    FrequencyOption,
    SubscriptionDetail,
} from '#views/MySubscription/common';

import i18n from './i18n.json';
import styles from './styles.module.css';

const ALERT_ENUMS_AND_ALL_COUNTRY = gql`
query AlertEnumsAndAllCountryList {
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

type AdminOption = NonNullable<NonNullable<NonNullable<FilteredAdminListQuery['public']>['admin1s']>['items']>[number];

type Urgency = NonNullable<AlertEnumsQuery['enums']['AlertInfoUrgency']>[number];
type Severity = NonNullable<AlertEnumsQuery['enums']['AlertInfoSeverity']>[number];
type Certainty = NonNullable<AlertEnumsQuery['enums']['AlertInfoCertainty']>[number];

interface AlertFilters {
    key: string;
    label: string;
}

const adminKeySelector = (admin1: AdminOption) => admin1.id;
const urgencyKeySelector = (urgency: Urgency) => urgency.key;
const severityKeySelector = (severity: Severity) => severity.key;
const certaintyKeySelector = (certainty: Certainty) => certainty.key;
const labelSelector = (alert: AlertFilters) => alert.label;

const frequencyKeySelector = (frequency: FrequencyOption) => frequency.key;
const frequencyLabelSelector = (frequency: FrequencyOption) => frequency.label;

const frequencyOption: FrequencyOption[] = [
    { label: 'Daily', key: 'daily' },
    { label: 'Weekly', key: 'weekly' },
];

type PartialFormFields = PartialForm<SubscriptionDetail>;

type FormSchema = ObjectSchema<PartialFormFields>;
type FormSchemaFields = ReturnType<FormSchema['fields']>

const formSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        title: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        urgency: {
            required: true,
            requiredValidation: requiredCondition,
        },
        severity: {
            required: true,
            requiredValidation: requiredCondition,
        },
        certainty: {
            required: true,
            requiredValidation: requiredCondition,
        },
        country: {
            required: true,
            requiredValidation: requiredCondition,
        },
        admin1: {
            required: true,
            requiredValidation: requiredCondition,
        },
        sendEmail: {
            required: true,
            requiredValidation: requiredCondition,
        },
        frequency: {
            required: true,
            requiredValidation: requiredCondition,
        },
    }),
};

interface Props {
    subscription: SubscriptionDetail;
    onCloseModal?: () => void;
}

function NewSubscriptionModal(props: Props) {
    const {
        subscription,
        onCloseModal,
    } = props;

    const defaultFormValue = useMemo(() => ({
        title: subscription?.title,
        urgency: subscription?.urgency,
        severity: subscription?.severity,
        certainty: subscription?.certainty,
        sendEmail: subscription?.sendEmail,
        frequency: subscription?.frequency,
        country: subscription?.country,
        admin1: subscription?.admin1,
    }), [
        subscription,
    ]);

    const {
        value,
        setFieldValue,
        error: formError,
        // setError,
        // validate,
    } = useForm(formSchema, { value: defaultFormValue });

    const fieldError = getErrorObject(formError);

    const strings = useTranslation(i18n);
    const {
        data: alertEnumsResponse,
    } = useQuery<AlertEnumsAndAllCountryListQuery, AlertEnumsAndAllCountryListQueryVariables>(
        ALERT_ENUMS_AND_ALL_COUNTRY,
    );

    const adminQueryVariables = useMemo<FilteredAdminListQueryVariables>(
        () => {
            if (isNotDefined(value.country)) {
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
                    country: { pk: value.country },
                },
                // FIXME: Implement search select input
                pagination: {
                    offset: 0,
                    limit: 500,
                },
            };
        },
        [value.country],
    );

    const {
        data: adminResponse,
    } = useQuery<FilteredAdminListQuery, FilteredAdminListQueryVariables>(
        ADMIN_LIST,
        { variables: adminQueryVariables, skip: isNotDefined(value.country) },
    );

    const subscriptionCreate = useCallback(() => {
        // eslint-disable-next-line no-console
        console.info('create');
    }, []);

    return (
        <Modal
            className={styles.subscriptionModal}
            heading={strings.newSubscriptionHeading}
            footerContent={(
                <Button
                    name={undefined}
                    onClick={subscriptionCreate}
                    disabled={isNotDefined(value.title)}
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
                name="title"
                label={strings.newSubscriptionTitle}
                value={value.title}
                error={fieldError?.title}
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
                    labelSelector={labelSelector}
                    value={value.urgency}
                    onChange={setFieldValue}
                />
                <MultiSelectInput
                    label={strings.filterSeverityLabel}
                    placeholder={strings.filterSeverityPlaceholder}
                    name="severity"
                    options={alertEnumsResponse?.enums.AlertInfoSeverity}
                    keySelector={severityKeySelector}
                    labelSelector={labelSelector}
                    value={value.severity}
                    onChange={setFieldValue}
                />
                <MultiSelectInput
                    label={strings.filterCertaintyLabel}
                    placeholder={strings.filterCertaintyPlaceholder}
                    name="certainty"
                    options={alertEnumsResponse?.enums.AlertInfoCertainty}
                    keySelector={certaintyKeySelector}
                    labelSelector={labelSelector}
                    value={value.certainty}
                    onChange={setFieldValue}
                />
                <SelectInput
                    label={strings.filterCountriesLabel}
                    placeholder={strings.filterCountriesPlaceholder}
                    name="country"
                    options={alertEnumsResponse?.public.allCountries}
                    keySelector={stringIdSelector}
                    labelSelector={stringNameSelector}
                    value={value.country}
                    onChange={setFieldValue}
                />
                <SelectInput
                    label={strings.filterAdmin1Label}
                    placeholder={strings.filterAdmin1Placeholder}
                    name="admin1"
                    disabled={isNotDefined(value.country)}
                    options={adminResponse?.public.admin1s.items}
                    keySelector={adminKeySelector}
                    labelSelector={stringNameSelector}
                    value={value.admin1}
                    onChange={setFieldValue}
                />
            </div>
            <Checkbox
                label={strings.sendViaEmailLabel}
                name="sendEmail"
                value={value.sendEmail}
                error={fieldError?.sendEmail}
                onChange={setFieldValue}
            />
            <RadioInput
                name="frequency"
                options={frequencyOption}
                keySelector={frequencyKeySelector}
                labelSelector={frequencyLabelSelector}
                value={value?.frequency}
                onChange={setFieldValue}
                disabled={isNotDefined(value.sendEmail)}
            />
        </Modal>
    );
}

export default NewSubscriptionModal;
