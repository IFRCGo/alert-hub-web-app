import Map, {
    MapLayer,
    MapSource,
} from '@togglecorp/re-map';
import { type SymbolLayer } from 'mapbox-gl';

import {
    adminLabelLayerOptions,
    defaultMapOptions,
    defaultMapStyle,
    defaultNavControlOptions,
    defaultNavControlPosition,
} from '#utils/map';

type MapProps = Parameters<typeof Map>[0];

type overrides = 'mapStyle' | 'mapOptions' | 'navControlShown' | 'navControlPosition' | 'navControlOptions' | 'scaleControlShown';

type BaseMapProps = Omit<MapProps, overrides> & {
    baseLayers?: React.ReactNode;
    withDisclaimer?: boolean;
    withoutLabel?: boolean;
} & Partial<Pick<MapProps, overrides>>;

const sourceOptions: mapboxgl.GeoJSONSourceRaw = {
    type: 'geojson',
};

const adminLabelOverrideOptions: Omit<SymbolLayer, 'id'> = {
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
        'text-halo-color': '#555555',
        'text-halo-width': 0.2,
    },
};

function BaseMap(props: BaseMapProps) {
    const {
        baseLayers,
        mapStyle,
        mapOptions,
        navControlShown,
        navControlPosition,
        navControlOptions,
        scaleControlShown,
        children,
        withoutLabel = false,
        ...otherProps
    } = props;

    return (
        <Map
            mapStyle={mapStyle ?? defaultMapStyle}
            mapOptions={mapOptions ?? defaultMapOptions}
            navControlShown={navControlShown ?? true}
            navControlPosition={navControlPosition ?? defaultNavControlPosition}
            navControlOptions={navControlOptions ?? defaultNavControlOptions}
            scaleControlShown={scaleControlShown ?? false}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...otherProps}
        >
            <MapSource
                sourceKey="composite"
                sourceOptions={sourceOptions}
            >
                <MapLayer
                    layerKey="admin-0-label"
                    layerOptions={adminLabelLayerOptions}
                />
                <MapLayer
                    layerKey="admin-0-label-non-independent"
                    layerOptions={adminLabelLayerOptions}
                />
                <MapLayer
                    layerKey="admin-0-label-priority"
                    layerOptions={adminLabelLayerOptions}
                />
                {baseLayers}
            </MapSource>
            {!withoutLabel && (
                <MapSource
                    sourceKey="override-labels"
                    sourceOptions={sourceOptions}
                    geoJson={undefined}
                >
                    <MapLayer
                        layerKey="point-circle"
                        layerOptions={adminLabelOverrideOptions}
                    />
                </MapSource>
            )}
            {children}
        </Map>
    );
}

export default BaseMap;
