import { Link } from 'react-router-dom';
import { Container } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { _cs } from '@togglecorp/fujs';
import {
    MapBounds,
    MapContainer,
    MapLayer,
} from '@togglecorp/re-map';
import type { LngLatBoundsLike } from 'mapbox-gl';

import BaseMap from '#components/domain/BaseMap';
import {
    DEFAULT_MAP_PADDING,
    DURATION_MAP_ZOOM,
} from '#utils/constants';
import { adminFillLayerOptions } from '#utils/map';

import i18n from './i18n.json';
import styles from './styles.module.css';

type Props = {
    className?: string;
    bbox: LngLatBoundsLike | undefined;
}

function OngoingAlertMap(props: Props) {
    const {
        className,
        bbox,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <Container
            className={_cs(styles.alertMap, className)}
            heading={strings.mapHeading}
            withHeaderBorder
            childrenContainerClassName={styles.content}
            actions={(
                <Link
                    className={styles.sources}
                    // FIXME: Add source route
                    to="/"
                >
                    {strings.mapViewAllSources}
                </Link>
            )}
        >
            <BaseMap
                baseLayers={(
                    <MapLayer
                        layerKey="admin-0"
                        layerOptions={adminFillLayerOptions}
                        onClick={undefined}
                    />
                )}
            >
                <MapContainer
                    className={styles.mapContainer}
                />
                <MapBounds
                    duration={DURATION_MAP_ZOOM}
                    bounds={bbox}
                    padding={DEFAULT_MAP_PADDING}
                />
            </BaseMap>
        </Container>
    );
}

export default OngoingAlertMap;
