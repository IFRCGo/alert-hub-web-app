import { useCallback } from 'react';
import {
    MultiSelectInput,
    SelectInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { stringNameSelector } from '@ifrc-go/ui/utils';

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

interface AlertFilters {
    key: string;
    label: string;
}

const countryKeySelector = (country: CountryOption) => country.id;

const adminKeySelector =(admin: AdminOption) => admin.id;

const keySelector = (alert: AlertFilters) => alert.key;
const labelSelector = (alert: AlertFilters) => alert.label;

export interface FilterValue {
    countries: string | undefined;
    admin1: string | undefined;
    urgencyList: string[];
    severityList: string[];
    certaintyList: string[];
}

interface Props {
    value: FilterValue;
    onChange: React.Dispatch<React.SetStateAction<FilterValue>>;
    onCountryChange: (...args: EntriesAsList<FilterValue>) => void;
    admin1?: NonNullable<NonNullable<NonNullable<AdminListQuery['public']>['admin1s']>['items']>;
    countries?: NonNullable<CountryListQuery['public']['allCountries']>;
    urgencyList?: NonNullable<AlertEnumsQuery['enums']['AlertInfoUrgency']>;
    severityList?: NonNullable<AlertEnumsQuery['enums']['AlertInfoSeverity']>;
    certaintyList?: NonNullable<AlertEnumsQuery['enums']['AlertInfoCertainty']>;
}

function Filters(props: Props) {
    const {
        value,
        onChange,
        countries,
        admin1,
        urgencyList,
        severityList,
        certaintyList,
        onCountryChange,
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

    return (
        <div className={styles.filters}>
            <SelectInput
                placeholder={strings.alertCountries}
                name="countries"
                options={countries}
                keySelector={countryKeySelector}
                labelSelector={stringNameSelector}
                value={value.countries}
                onChange={onCountryChange}
            />
            <SelectInput
                placeholder={strings.alertAdmin1}
                name="admin1"
                options={admin1}
                keySelector={adminKeySelector}
                labelSelector={stringNameSelector}
                value={value.admin1}
                onChange={onCountryChange}
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
