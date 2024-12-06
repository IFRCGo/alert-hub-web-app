import {
    useContext,
    useMemo,
} from 'react';
import { isDefined } from '@togglecorp/fujs';

import { AlertFilter } from '#generated/types/graphql';

import AlertDataContext from './AlertDataContext';

function useAlertFilters() {
    const {
        selectedCertaintyTypes,
        selectedSeverityTypes,
        selectedUrgencyTypes,
        activeCountryId,
        activeAdmin1Id,
        selectedCategoryTypes,
    } = useContext(AlertDataContext);

    const certaintyDefined = isDefined(selectedCertaintyTypes) && selectedCertaintyTypes.length > 0;
    const severityDefined = isDefined(selectedSeverityTypes) && selectedSeverityTypes.length > 0;
    const urgencyDefined = isDefined(selectedUrgencyTypes) && selectedUrgencyTypes.length > 0;
    const categoryDefined = isDefined(selectedCategoryTypes) && selectedCategoryTypes.length > 0;

    const alertFilters = useMemo<AlertFilter>(
        () => ({
            infos: (certaintyDefined || severityDefined || urgencyDefined || categoryDefined) ? ({
                certainty: certaintyDefined
                    ? selectedCertaintyTypes
                    : undefined,
                severity: severityDefined
                    ? selectedSeverityTypes
                    : undefined,
                urgency: urgencyDefined
                    ? selectedUrgencyTypes
                    : undefined,
                category: categoryDefined
                    ? selectedCategoryTypes
                    : undefined,
            }) : undefined,
            country: isDefined(activeCountryId) ? { pk: activeCountryId } : undefined,
            admin1: isDefined(activeAdmin1Id) ? activeAdmin1Id : undefined,
        }),
        [
            certaintyDefined,
            severityDefined,
            urgencyDefined,
            categoryDefined,
            selectedCategoryTypes,
            activeAdmin1Id,
            activeCountryId,
            selectedUrgencyTypes,
            selectedSeverityTypes,
            selectedCertaintyTypes,
        ],
    );

    return alertFilters;
}

export default useAlertFilters;
