import {
    AlertInfoCertaintyEnum,
    AlertInfoSeverityEnum,
    AlertInfoUrgencyEnum,
} from '#generated/types/graphql';

export interface FrequencyOption {
    label: string;
    key: 'daily' | 'weekly';
}

export interface AlertFilters {
    id: string;
    filters: string[];
}

export interface AlertInfo {
    id: string;
    alertId: string;
    alertTitle: string;
    alertDescription?: string;
}

export interface SubscriptionAndAlertDetail {
    id: string;
    alertFilters: string[];
    alertInfo?: AlertInfo[] | undefined;
}

// TODO: Add subscription interface from  generated
export interface SubscriptionDetail {
    id: string;
    title: string;
    country: string | undefined;
    admin1: string | undefined;
    urgency?: AlertInfoUrgencyEnum[] | undefined;
    certainty?: AlertInfoCertaintyEnum[] | undefined;
    severity?: AlertInfoSeverityEnum[] | undefined;
    totalCount?: number;
    sendEmail?: boolean;
    frequency?: 'daily' | 'weekly' | undefined;
}
