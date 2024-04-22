import {
    useCallback,
    useMemo,
} from 'react';
import {
    MultiSelectInput,
    SelectInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { stringNameSelector } from '@ifrc-go/ui/utils';
import { isNotDefined } from '@togglecorp/fujs';

import {
    AdminListQuery,
    AlertEnumsQuery,
    CountryListQuery,
} from '#generated/types/graphql';

import { EntriesAsList } from '../../../types';

import i18n from './i18n.json';
import styles from './styles.module.css';

type CountryOption = NonNullable<NonNullable<CountryListQuery['public']>['allCountries']>[number];
type AdminOption = NonNullable<NonNullable<NonNullable<AdminListQuery['public']>['admin1s']>['items']>[number];

type Admin1 = NonNullable<NonNullable<NonNullable<AdminListQuery['public']>['admin1s']>['items']>;
type Countries = NonNullable<CountryListQuery['public']['allCountries']>;
type Urgency = NonNullable<AlertEnumsQuery['enums']['AlertInfoUrgency']>;
type Severity = NonNullable<AlertEnumsQuery['enums']['AlertInfoSeverity']>;
type Certainty = NonNullable<AlertEnumsQuery['enums']['AlertInfoCertainty']>;

interface AlertFilters {
    key: string;
    label: string;
}

const countryKeySelector = (country: CountryOption) => country.id;
const countryLabelSelector = (country: CountryOption) => country.name;

const adminKeySelector = (admin1: AdminOption) => admin1.id;

const keySelector = (alert: AlertFilters) => alert.key;
const labelSelector = (alert: AlertFilters) => alert.label;

export interface FilterValue {
    countryList: string | undefined;
    admin1List: string | undefined;
    urgencyList: string[];
    severityList: string[];
    certaintyList: string[];
}

interface Props {
    value: FilterValue;
    onChange: React.Dispatch<React.SetStateAction<FilterValue>>;
    admin1List?: Admin1;
    countryList?: Countries;
    urgencyList?: Urgency;
    severityList?: Severity;
    certaintyList?: Certainty;
}

function Filters(props: Props) {
    const {
        value,
        onChange,
        countryList,
        admin1List,
        urgencyList,
        severityList,
        certaintyList,
    } = props;

    const strings = useTranslation(i18n);

    const handleChange = useCallback(
        (...args: EntriesAsList<FilterValue>) => {
            const [val, key] = args;
            onChange((prevValue): FilterValue => ({
                ...prevValue,
                [key]: val,
            }));
        },
        [onChange],
    );

    const filteredAdmin1 = useMemo(() => {
        if (isNotDefined(value.countryList) || isNotDefined(admin1List)) return admin1List;

        const selectedCountry = countryList?.find(
            (country: CountryOption) => country.id === value.certaintyList,
        );

        if (isNotDefined(selectedCountry)) return admin1List;

        return admin1List?.filter(
            (admin: AdminOption) => admin.countryId === selectedCountry.id,
        );
    }, [
        value.countryList,
        admin1List,
        countryList,
        value.certaintyList,
    ]);

    return (
        <div className={styles.filters}>
            <SelectInput
                placeholder={strings.alertCountries}
                name="country"
                options={countryList}
                keySelector={countryKeySelector}
                labelSelector={countryLabelSelector}
                value={value.countryList}
                onChange={handleChange}
            />
            <SelectInput
                placeholder={strings.alertAdmin1}
                name="admin1"
                options={filteredAdmin1}
                keySelector={adminKeySelector}
                labelSelector={stringNameSelector}
                value={value.admin1List}
                onChange={handleChange}
            />
            <MultiSelectInput
                placeholder={strings.alertUrgency}
                name="urgencyList"
                options={urgencyList}
                keySelector={keySelector}
                labelSelector={labelSelector}
                value={value.urgencyList}
                onChange={handleChange}
            />
            <MultiSelectInput
                placeholder={strings.alertSeverity}
                name="severityList"
                options={severityList}
                keySelector={keySelector}
                labelSelector={labelSelector}
                value={value.severityList}
                onChange={handleChange}
            />
            <MultiSelectInput
                placeholder={strings.alertCertainty}
                name="certaintyList"
                options={certaintyList}
                keySelector={keySelector}
                labelSelector={labelSelector}
                value={value.certaintyList}
                onChange={handleChange}
            />
        </div>
    );
}

export default Filters;
