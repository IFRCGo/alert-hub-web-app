import { useCallback } from 'react';
import { MultiSelectInput } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { stringNameSelector } from '@ifrc-go/ui/utils';

import {
    AlertEnumsQuery,
    CountryListQuery,
} from '#generated/types/graphql';

import { EntriesAsList } from '../../../types';

import i18n from './i18n.json';
import styles from './styles.module.css';

type CountryType = NonNullable<NonNullable<CountryListQuery['public']>['allCountries']>[number];

interface AlertFilters {
    key: string;
    label: string;
}

const countryKeySelector = (country: CountryType) => country.id;

const keySelector = (alert: AlertFilters) => alert.key;
const labelSelector = (alert: AlertFilters) => alert.label;

export interface FilterValue {
    countries: string[];
    urgencyList: string[];
    severityList: string[];
    certaintyList: string[];
}

interface Props {
    value: FilterValue;
    onChange: React.Dispatch<React.SetStateAction<FilterValue>>;
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

    return (
        <div className={styles.filters}>
            <MultiSelectInput
                placeholder={strings.alertCountries}
                name="countries"
                options={countries}
                keySelector={countryKeySelector}
                labelSelector={stringNameSelector}
                value={value.countries}
                onChange={handleChange}
                withSelectAll
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
