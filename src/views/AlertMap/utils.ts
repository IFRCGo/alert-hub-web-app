import type {
    CircleLayer,
    CirclePaint,
} from 'mapbox-gl';

// FIXME: these must be a constant defined somewhere else
export const APPEAL_TYPE_DREF = 0;
export const APPEAL_TYPE_EMERGENCY = 1;
// const APPEAL_TYPE_INTERNATIONAL = 2; // TODO: we are not showing this?
export const APPEAL_TYPE_EAP = 3;
export const APPEAL_TYPE_MULTIPLE = -1;


const basePointPaint: CirclePaint = {
    'circle-radius': 5,
    'circle-opacity': 0.8,
};

export const basePointLayerOptions: Omit<CircleLayer, 'id'> = {
    type: 'circle',
    paint: basePointPaint,
};

const baseOuterCirclePaint: CirclePaint = {
    'circle-opacity': 0.4,
};

const outerCirclePaintForFinancialRequirements: CirclePaint = {
    ...baseOuterCirclePaint,
    'circle-radius': [
        'interpolate',
        ['linear', 1],
        ['get', 'financialRequirements'],
        1000,
        7,
        10000,
        9,
        100000,
        11,
        1000000,
        15,
    ],
};

const outerCirclePaintForPeopleTargeted: CirclePaint = {
    ...baseOuterCirclePaint,
    'circle-radius': [
        'interpolate',
        ['linear', 1],
        ['get', 'peopleTargeted'],
        1000,
        7,
        10000,
        9,
        100000,
        11,
        1000000,
        15,
    ],
};

export const outerCircleLayerOptionsForFinancialRequirements: Omit<CircleLayer, 'id'> = {
    type: 'circle',
    paint: outerCirclePaintForFinancialRequirements,
};

export const outerCircleLayerOptionsForPeopleTargeted: Omit<CircleLayer, 'id'> = {
    type: 'circle',
    paint: outerCirclePaintForPeopleTargeted,
};

export interface ScaleOption {
    label: string;
    value: 'financialRequirements' | 'peopleTargeted';
}

export function optionKeySelector(option: ScaleOption) {
    return option.value;
}

export function optionLabelSelector(option: ScaleOption) {
    return option.label;
}
