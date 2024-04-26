import Map, { MapSource } from '@togglecorp/re-map';

import {
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
} & Partial<Pick<MapProps, overrides>>;

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
                managed={false}
            >
                {/*
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
                */}
                {baseLayers}
            </MapSource>
            {children}
        </Map>
    );
}

export default BaseMap;
