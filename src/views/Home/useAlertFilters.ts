import {
    useContext,
    useMemo,
} from 'react';
import { isDefined } from '@togglecorp/fujs';

import { AlertFilter } from '#generated/types/graphql';

import AlertContext from './AlertContext';

function useAlertFilters() {
    const {
        selectedCertaintyTypes,
        selectedSeverityTypes,
        selectedUrgencyTypes,
    } = useContext(AlertContext);

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
        }),
        [selectedUrgencyTypes, selectedSeverityTypes, selectedCertaintyTypes],
    );

    return alertFilters;
}

export default useAlertFilters;
