import {
    useContext,
    useMemo,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    DateInput,
    MultiSelectInput,
    SelectInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { isNotDefined } from '@togglecorp/fujs';

import {
    AlertEnumsQuery,
    AlertEnumsQueryVariables,
    AllCountryListQuery,
    AllCountryListQueryVariables,
    FilteredAdminListQuery,
    FilteredAdminListQueryVariables,
    RegionListQuery,
    RegionListQueryVariables,
} from '#generated/types/graphql';
import {
    stringIdSelector,
    stringNameSelector,
} from '#utils/selectors';

import AlertDataContext from '../AlertDataContext';

import i18n from './i18n.json';

type AdminOption = NonNullable<NonNullable<NonNullable<FilteredAdminListQuery['public']>['admin1s']>['items']>[number];

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

const ALERT_ENUMS = gql`
query AlertEnums {
    enums {
      AlertInfoCertainty {
        key
        label
      }
      AlertInfoUrgency {
        label
        key
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
}`;

const ADMIN_LIST = gql`
query FilteredAdminList($filters:Admin1Filter) {
    public {
      id
      admin1s(filters: $filters) {
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

const REGION_LIST = gql`
query RegionList {
    public {
        id
      regions {
        items {
          id
          name
          ifrcGoId
        }
      }
    }
  }
`;

const ALL_COUNTRY_LIST = gql`
query AllCountryList {
  public {
    id
    allCountries {
      name
      id
      iso3
      ifrcGoId
      alertCount
    }
  }
}
`;

interface Props {
    variant: 'map' | 'table';
}

function AlertFilters(props: Props) {
    const { variant } = props;

    const {
        activeCountryId,
        activeAdmin1Id,
        selectedSeverityTypes,
        selectedUrgencyTypes,
        selectedCertaintyTypes,
        activeRegionId,
        startDateFrom,
        startDateTo,
        setActiveCountryId,
        setActiveAdmin1Id,
        setSelectedSeverityTypes,
        setSelectedUrgencyTypes,
        setSelectedCertaintyTypes,
        setActiveRegionId,
        setStartDateFrom,
        setStartDateTo,
        selectedCategoryTypes,
        setSelectedCategoryTypes,
    } = useContext(AlertDataContext);

    const strings = useTranslation(i18n);

    const {
        data: alertEnumsResponse,
    } = useQuery<AlertEnumsQuery, AlertEnumsQueryVariables>(
        ALERT_ENUMS,
    );

    const {
        data: regionResponse,
    } = useQuery<RegionListQuery, RegionListQueryVariables>(
        REGION_LIST,
    );

    const {
        data: allCountryListResponse,
    } = useQuery<AllCountryListQuery, AllCountryListQueryVariables>(
        ALL_COUNTRY_LIST,
    );

    const adminQueryVariables = useMemo<FilteredAdminListQueryVariables>(
        () => {
            if (isNotDefined(activeCountryId)) {
                return { filters: undefined };
            }

            return {
                filters: {
                    country: { pk: activeCountryId },
                },
            };
        },
        [activeCountryId],
    );

    const {
        data: adminResponse,
    } = useQuery<FilteredAdminListQuery, FilteredAdminListQueryVariables>(
        ADMIN_LIST,
        { variables: adminQueryVariables },
    );

    return (
        <>
            <MultiSelectInput
                label={strings.filterUrgencyLabel}
                placeholder={strings.filterUrgencyPlaceholder}
                name="urgencyList"
                options={alertEnumsResponse?.enums.AlertInfoUrgency}
                keySelector={urgencyKeySelector}
                labelSelector={labelSelector}
                value={selectedUrgencyTypes}
                onChange={setSelectedUrgencyTypes}
            />
            <MultiSelectInput
                label={strings.filterSeverityLabel}
                placeholder={strings.filterSeverityPlaceholder}
                name="severityList"
                options={alertEnumsResponse?.enums.AlertInfoSeverity}
                keySelector={severityKeySelector}
                labelSelector={labelSelector}
                value={selectedSeverityTypes}
                onChange={setSelectedSeverityTypes}
            />
            <MultiSelectInput
                label={strings.filterCertaintyLabel}
                placeholder={strings.filterCertaintyPlaceholder}
                name="certaintyList"
                options={alertEnumsResponse?.enums.AlertInfoCertainty}
                keySelector={certaintyKeySelector}
                labelSelector={labelSelector}
                value={selectedCertaintyTypes}
                onChange={setSelectedCertaintyTypes}
            />
            <DateInput
                name="startDateFrom"
                label={strings.filterStartDateFrom}
                value={startDateFrom}
                onChange={setStartDateFrom}
            />
            <DateInput
                name="startDateTo"
                label={strings.filterStartDateTo}
                value={startDateTo}
                onChange={setStartDateTo}
            />
            {variant === 'table' && (
                <MultiSelectInput
                    label={strings.filterCategoriesLabel}
                    placeholder={strings.filterCategoriesPlaceholder}
                    name="categoryList"
                    options={alertEnumsResponse?.enums.AlertInfoCategory}
                    keySelector={categoryKeySelector}
                    labelSelector={categoryLabelSelector}
                    value={selectedCategoryTypes}
                    onChange={setSelectedCategoryTypes}
                />
            )}
            {variant === 'table' && (
                <SelectInput
                    label={strings.filterRegionsLabel}
                    placeholder={strings.filterRegionsPlaceholder}
                    name="region"
                    options={regionResponse?.public.regions.items}
                    keySelector={stringIdSelector}
                    labelSelector={stringNameSelector}
                    value={activeRegionId}
                    onChange={setActiveRegionId}
                />
            )}
            <SelectInput
                label={strings.filterCountriesLabel}
                placeholder={strings.filterCountriesPlaceholder}
                name="country"
                options={allCountryListResponse?.public.allCountries}
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
                options={adminResponse?.public.admin1s.items}
                keySelector={adminKeySelector}
                labelSelector={stringNameSelector}
                value={activeAdmin1Id}
                onChange={setActiveAdmin1Id}
            />
        </>
    );
}

export default AlertFilters;
