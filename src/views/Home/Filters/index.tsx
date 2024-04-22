import {
    useContext,
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
    AlertEnumsQuery,
    CountryListQuery,
    FilteredAdminListQuery,
} from '#generated/types/graphql';
import { stringIdSelector } from '#utils/selectors';

import AlertContext from '../AlertContext';

import i18n from './i18n.json';
import styles from './styles.module.css';

type AdminOption = NonNullable<NonNullable<NonNullable<FilteredAdminListQuery['public']>['admin1s']>['items']>[number];

type Admin1 = NonNullable<NonNullable<NonNullable<FilteredAdminListQuery['public']>['admin1s']>['items']>;
type Countries = NonNullable<CountryListQuery['public']['allCountries']>;
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

interface Props {
    admin1List?: Admin1;
    countryList?: Countries;
    urgencyList?: Urgency[];
    severityList?: Severity[];
    certaintyList?: Certainty[];
}

function Filters(props: Props) {
    const {
        countryList,
        admin1List,
        urgencyList,
        severityList,
        certaintyList,
    } = props;

    const {
        activeCountryId,
        activeAdmin1Id,
        selectedSeverityTypes,
        selectedUrgencyTypes,
        selectedCertaintyTypes,
        setActiveCountryId,
        setActiveAdmin1Id,
        setSelectedSeverityTypes,
        setSelectedUrgencyTypes,
        setSelectedCertaintyTypes,
    } = useContext(AlertContext);

    const strings = useTranslation(i18n);

    // TODO: this should be done in server
    const admin1ListForSelectedCountry = useMemo(
        () => (
            admin1List?.filter(
                ({ countryId }) => countryId === activeCountryId,
            )
        ),
        [activeCountryId, admin1List],
    );

    return (
        <div className={styles.filters}>
            <MultiSelectInput
                label={strings.alertUrgency}
                placeholder={strings.alertUrgency}
                name="urgencyList"
                options={urgencyList}
                keySelector={urgencyKeySelector}
                labelSelector={labelSelector}
                value={selectedUrgencyTypes}
                onChange={setSelectedUrgencyTypes}
            />
            <MultiSelectInput
                label={strings.alertSeverity}
                placeholder={strings.alertSeverity}
                name="severityList"
                options={severityList}
                keySelector={severityKeySelector}
                labelSelector={labelSelector}
                value={selectedSeverityTypes}
                onChange={setSelectedSeverityTypes}
            />
            <MultiSelectInput
                label={strings.alertCertainty}
                placeholder={strings.alertCertainty}
                name="certaintyList"
                options={certaintyList}
                keySelector={certaintyKeySelector}
                labelSelector={labelSelector}
                value={selectedCertaintyTypes}
                onChange={setSelectedCertaintyTypes}
            />
            <SelectInput
                label={strings.alertCountries}
                placeholder={strings.alertCountries}
                name="country"
                options={countryList}
                keySelector={stringIdSelector}
                labelSelector={stringNameSelector}
                value={activeCountryId}
                onChange={setActiveCountryId}
            />
            <SelectInput
                label={strings.alertAdmin1}
                placeholder={strings.alertAdmin1}
                name="admin1"
                disabled={isNotDefined(activeCountryId)}
                options={admin1ListForSelectedCountry}
                keySelector={adminKeySelector}
                labelSelector={stringNameSelector}
                value={activeAdmin1Id}
                onChange={setActiveAdmin1Id}
            />
        </div>
    );
}

export default Filters;
