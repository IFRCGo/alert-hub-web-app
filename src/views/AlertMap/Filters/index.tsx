import { useCallback, useMemo } from 'react';
import {
    MultiSelectInput,
} from '@ifrc-go/ui';
import { gql } from '@apollo/client';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    stringNameSelector,
} from '@ifrc-go/ui/utils';
import { listToGroupList } from '@togglecorp/fujs';
import { EntriesAsList } from '@togglecorp/toggle-form';

import { CountryListQuery } from '#generated/types';

import i18n from './i18n.json';

type CountryType = NonNullable<NonNullable<NonNullable<CountryListQuery['public']>['countries']>['items']>[number];

const countryKeySelector = (country: CountryType) => country?.id;

export interface FilterValue {
    countries: string[];
    regions: string[];
}

interface Props {
    value: FilterValue;
    onChange: React.Dispatch<React.SetStateAction<FilterValue>>;
    countries?: NonNullable<CountryListQuery['public']['countries']['items']>;
}

function Filters(props: Props) {
    const {
        value,
        onChange,
        countries,
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
        <MultiSelectInput
            placeholder={strings.riskAllCountries}
            name="countries"
            options={countries}
            keySelector={countryKeySelector}
            labelSelector={stringNameSelector}
            value={value.countries}
            onChange={handleChange}
            withSelectAll
        />
    );
}

export default Filters;
