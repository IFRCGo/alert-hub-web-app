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
    } = useContext(AlertDataContext);

    const alertFilters = useMemo<AlertFilter>(
        () => ({
            certainty: isDefined(selectedCertaintyTypes) && selectedCertaintyTypes.length > 0
                ? selectedCertaintyTypes
                : undefined,
            severity: isDefined(selectedSeverityTypes) && selectedSeverityTypes.length > 0
                ? selectedSeverityTypes
                : undefined,
            urgency: isDefined(selectedUrgencyTypes) && selectedUrgencyTypes.length > 0
                ? selectedUrgencyTypes
                : undefined,
            country: isDefined(activeCountryId) ? { pk: activeCountryId } : undefined,
            admin1: isDefined(activeAdmin1Id) ? activeAdmin1Id : undefined,
        }),
        [
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
