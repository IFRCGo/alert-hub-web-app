import type {
    FillLayer,
    Map,
    NavigationControl,
    SymbolLayer,
} from 'mapbox-gl';

// TODO: Verify if we are using the ifrc go mapbox api and styles
export const defaultMapStyle = 'mapbox://styles/go-ifrc/ckrfe16ru4c8718phmckdfjh0';
type NavControlOptions = NonNullable<ConstructorParameters<typeof NavigationControl>[0]>;
export const defaultNavControlOptions: NavControlOptions = {
    showCompass: false,
};

type ControlPosition = NonNullable<Parameters<Map['addControl']>[1]>;
export const defaultNavControlPosition: ControlPosition = 'top-right';

export const defaultMapOptions: Omit<mapboxgl.MapboxOptions, 'style' | 'container'> = {
    logoPosition: 'bottom-left' as const,
    zoom: 1.5,
    minZoom: 1,
    maxZoom: 18,
    scrollZoom: false,
    pitchWithRotate: false,
    dragRotate: false,
    renderWorldCopies: true,
    attributionControl: false,
    preserveDrawingBuffer: true,
    // interactive: false,
};

const DEFAULT_CIRCLE_SIZE = 'medium';
const DEFAULT_CIRCLE_OPACITY = 'full';

export const CIRCLE_RADIUS_SMALL = 3;
export const CIRCLE_RADIUS_MEDIUM = 5;
export const CIRCLE_RADIUS_LARGE = 8;
export const CIRCLE_RADIUS_EXTRA_LARGE = 12;
export const CIRCLE_RADIUS_SUPER_LARGE = 16;

export function getPointCirclePaint(
    color: string,
    size: 'small' | 'medium' | 'large' | 'extraLarge' = DEFAULT_CIRCLE_SIZE,
    opacity: 'full' | 'light' = DEFAULT_CIRCLE_OPACITY,
): mapboxgl.CirclePaint {
    const sizeMap = {
        small: CIRCLE_RADIUS_SMALL,
        medium: CIRCLE_RADIUS_MEDIUM,
        large: CIRCLE_RADIUS_LARGE,
        extraLarge: CIRCLE_RADIUS_EXTRA_LARGE,
    };

    const opacityMap = {
        full: 1,
        light: 0.7,
    };

    return {
        'circle-color': color,
        'circle-radius': sizeMap[size] ?? DEFAULT_CIRCLE_SIZE,
        'circle-opacity': opacityMap[opacity] ?? DEFAULT_CIRCLE_OPACITY,
        'circle-pitch-alignment': 'map',
    };
}

export const defaultTooltipOptions: mapboxgl.PopupOptions = {
    closeButton: false,
    offset: 10,
};

export const adminLabelLayerOptions : Omit<SymbolLayer, 'id'> = {
    type: 'symbol',
    layout: {
        visibility: 'none',
    },
};

export const adminLabelOverrideOptions: Omit<SymbolLayer, 'id'> = {
    type: 'symbol',
    layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Poppins Regular', 'Arial Unicode MS Regular'],
        'text-letter-spacing': 0.15,
        'text-line-height': 1.2,
        'text-max-width': 8,
        'text-justify': 'center',
        'text-anchor': 'top',
        'text-padding': 2,
        'text-size': [
            'interpolate', ['linear', 1], ['zoom'],
            0, 6,
            6, 16,
        ],
    },
    paint: {
        'text-color': '#000000',
        'text-halo-color': '#000000',
        'text-halo-width': 0.2,
    },
};

export const adminFillLayerOptions: Omit<FillLayer, 'id'> = {
    type: 'fill',
    layout: {
        visibility: 'visible',
    },
    paint: {
        'fill-color': [
            'case',
            ['boolean', ['feature-state', 'hovered'], false],
        ],
    },
};
