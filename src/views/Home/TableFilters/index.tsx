import { useContext } from 'react';
import {
    MultiSelectInput,
    SelectInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { isNotDefined } from '@togglecorp/fujs';

import {
    AlertEnumsQuery,
    CountryListQuery,
    FilteredAdminListQuery,
    RegionListQuery,
} from '#generated/types/graphql';
import {
    stringIdSelector,
    stringNameSelector,
} from '#utils/selectors';

import AlertContext from '../AlertContext';

import i18n from './i18n.json';
import styles from './styles.module.css';

type AdminOption = NonNullable<NonNullable<NonNullable<FilteredAdminListQuery['public']>['admin1s']>['items']>[number];

type Admin1 = NonNullable<NonNullable<NonNullable<FilteredAdminListQuery['public']>['admin1s']>['items']>;
type Countries = NonNullable<CountryListQuery['public']['allCountries']>;
type Regions = NonNullable<RegionListQuery['public']['regions']['items']>[number];

type Urgency = NonNullable<AlertEnumsQuery['enums']['AlertInfoUrgency']>[number];
type Severity = NonNullable<AlertEnumsQuery['enums']['AlertInfoSeverity']>[number];
type Certainty = NonNullable<AlertEnumsQuery['enums']['AlertInfoCertainty']>[number];
type Category = NonNullable<AlertEnumsQuery['enums']['AlertInfoCategory']>[number];

interface AlertFilters {
    key: string;
    label: string;
}

const adminKeySelector = (admin1: AdminOption) => admin1.id;
const urgencyKeySelector = (urgency: Urgency) => urgency.key;
const severityKeySelector = (severity: Severity) => severity.key;
const certaintyKeySelector = (certainty: Certainty) => certainty.key;
const labelSelector = (alert: AlertFilters) => alert.label;
const categoryKeySelector = (category: Category) => category.key;
const categoryLabelSelector = (category: Category) => category.label;

interface Props {
    admin1List?: Admin1;
    countryList?: Countries;
    urgencyList?: Urgency[];
    severityList?: Severity[];
    certaintyList?: Certainty[];
    regionsList? : Regions[];
    categoryList?: Category[];
}

function TableFilters(props: Props) {
    const {
        countryList,
        admin1List,
        urgencyList,
        severityList,
        certaintyList,
        regionsList,
        categoryList,
    } = props;

    const {
        activeCountryId,
        activeAdmin1Id,
        selectedSeverityTypes,
        selectedUrgencyTypes,
        selectedCertaintyTypes,
        activeRegionId,
        setActiveCountryId,
        setActiveAdmin1Id,
        setSelectedSeverityTypes,
        setSelectedUrgencyTypes,
        setSelectedCertaintyTypes,
        setActiveRegionId,
        selectedCategoryTypes,
        setSelectedCategoryTypes,
    } = useContext(AlertContext);

    const strings = useTranslation(i18n);

    return (
        <div className={styles.filters}>
            <MultiSelectInput
                label={strings.filterCategoriesLabel}
                placeholder={strings.filterCategoriesPlaceholder}
                name="categoryList"
                options={categoryList}
                keySelector={categoryKeySelector}
                labelSelector={categoryLabelSelector}
                value={selectedCategoryTypes}
                onChange={setSelectedCategoryTypes}
            />
            <SelectInput
                label={strings.filterRegionsLabel}
                placeholder={strings.filterRegionsPlaceholder}
                name="regionsList"
                options={regionsList}
                keySelector={stringIdSelector}
                labelSelector={stringNameSelector}
                value={activeRegionId}
                onChange={setActiveRegionId}
            />
            <MultiSelectInput
                label={strings.filterUrgencyLabel}
                placeholder={strings.filterUrgencyPlaceholder}
                name="urgencyList"
                options={urgencyList}
                keySelector={urgencyKeySelector}
                labelSelector={labelSelector}
                value={selectedUrgencyTypes}
                onChange={setSelectedUrgencyTypes}
            />
            <MultiSelectInput
                label={strings.filterSeverityLabel}
                placeholder={strings.filterSeverityPlaceholder}
                name="severityList"
                options={severityList}
                keySelector={severityKeySelector}
                labelSelector={labelSelector}
                value={selectedSeverityTypes}
                onChange={setSelectedSeverityTypes}
            />
            <MultiSelectInput
                label={strings.filterCertaintyLabel}
                placeholder={strings.filterCertaintyPlaceholder}
                name="certaintyList"
                options={certaintyList}
                keySelector={certaintyKeySelector}
                labelSelector={labelSelector}
                value={selectedCertaintyTypes}
                onChange={setSelectedCertaintyTypes}
            />
            <SelectInput
                label={strings.filterCountriesLabel}
                placeholder={strings.filterCountriesPlaceholder}
                name="country"
                options={countryList}
                keySelector={stringIdSelector}
                labelSelector={stringNameSelector}
                value={activeCountryId}
                onChange={setActiveCountryId}
            />
            <SelectInput
                label={strings.filterAdmin1Label}
                placeholder={strings.filterAdmin1Placeholder}
                name="admin1"
                disabled={isNotDefined(activeCountryId)}
                options={admin1List}
                keySelector={adminKeySelector}
                labelSelector={stringNameSelector}
                value={activeAdmin1Id}
                onChange={setActiveAdmin1Id}
            />
        </div>
    );
}

export default TableFilters;
