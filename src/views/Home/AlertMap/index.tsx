import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import { Link } from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { ChevronLeftLineIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
    List,
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    _cs,
    isDefined,
    isNotDefined,
    unique,
} from '@togglecorp/fujs';
import {
    MapBounds,
    MapContainer,
    MapLayer,
} from '@togglecorp/re-map';
import type {
    FillLayer,
    LngLatBoundsLike,
} from 'mapbox-gl';

import BaseMap from '#components/domain/BaseMap';
import MapPopup from '#components/MapPopup';
import {
    AlertEnumsQuery,
    AlertEnumsQueryVariables,
    CountryListQuery,
    CountryListQueryVariables,
} from '#generated/types';
import useDebouncedValue from '#hooks/useDebouncedValue';
import useInputState from '#hooks/useInputState';
import {
    COLOR_LIGHT_GREY,
    COLOR_PRIMARY_RED,
    DEFAULT_MAP_PADDING,
    DURATION_MAP_ZOOM,
} from '#utils/constants';

import CountryListItem, { CountryProps } from './CountryListItem';
import Filters, { FilterValue } from './Filters';
import RegionListItem from './RegionListItem';
import AlertListItem from './AlertListItem';

import i18n from './i18n.json';
import styles from './styles.module.css';

const COUNTRIES_LIST = gql`
query CountryList {
    public {
        allCountries {
          alertCount
          name
          id
          iso3
        }
    }
}`;

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
    }
}`;

const defaultFilterValue: FilterValue = {
    countries: [],
    regions: [],
    urgencyList: [],
    severityList: [],
    certaintyList: [],
};

type CountryType = NonNullable<NonNullable<CountryListQuery['public']>['allCountries']>[number];

export type AlertPointFeature = GeoJSON.Feature<GeoJSON.Point, AlertPointProperties>;

type AlertPointProperties = {
    id: string | number,
}

type Props = {
    className?: string;
    bbox: LngLatBoundsLike | undefined;
    onActiveCountryChange: (countryId: string | undefined) => void;
    activeCountryId: string | undefined;
}

const countryKeySelector = (country: CountryType) => country?.id;

interface ClickedPoint {
    feature: GeoJSON.Feature<GeoJSON.Point, CountryListQueryVariables>;
    lngLat: mapboxgl.LngLatLike;
}

function OngoingAlertMap(props: Props) {
    const {
        className,
        bbox,
        activeCountryId,
        onActiveCountryChange,
    } = props;

    const strings = useTranslation(i18n);
    const [filters, setFilters] = useInputState<FilterValue>(defaultFilterValue);
    const [activeAlertId, setActiveAlertId] = useState<string | undefined>();
    const [activeLearnOption, setActiveLearnOption] = useState('admin-1');

    const {
        data: countryResponse,
        loading: countryLoading,
    } = useQuery<CountryListQuery, CountryListQueryVariables>(
        COUNTRIES_LIST,
    );

    const {
        data: alertEnumsResponse,
    } = useQuery<AlertEnumsQuery, AlertEnumsQueryVariables>(
        ALERT_ENUMS,
    );

    const filteredCountries = countryResponse?.public.allCountries.filter(
        country => country.alertCount > 0
    );

    const [
        clickedPointProperties,
        setClickedPointProperties,
    ] = useState<ClickedPoint | undefined>();

    const handlePointClose = useCallback(
        () => {
            setClickedPointProperties(undefined);
        },
        [setClickedPointProperties],
    );

    const setActiveCountryIdSafe = useCallback(
        (countryId: string | undefined) => {
            onActiveCountryChange(countryId);
        },
        [onActiveCountryChange],
    );

    const countryListRendererParams = useCallback(
        (_: string | number, country: CountryType): CountryProps => ({
            data: country,
            onExpandClick: setActiveCountryIdSafe,
        }),
        [setActiveCountryIdSafe],
    );

    const handleCountryClick = useCallback((
        feature: mapboxgl.MapboxGeoJSONFeature,
        lngLat: mapboxgl.LngLatLike,
    ) => {
        setClickedPointProperties({
            feature: feature as unknown as ClickedPoint['feature'],
            lngLat,
        });
        return false;
    }, []);

    const [bounds, setBounds] = useState<LngLatBoundsLike | undefined>(bbox);
    const boundsSafe = useDebouncedValue(bounds);

    const countryFillOptions = useMemo<Omit<FillLayer, 'id'>>(() => {
        if (isNotDefined(filteredCountries)) {
            return {
                type: 'fill',
                layout: {
                    visibility: 'visible',
                },
            };
        }
        const uniqueCountries = unique(
            filteredCountries,
            (item) => item.iso3,
        );

        return {
            type: 'fill',
            paint: {
                'fill-opacity': 1,
                'fill-color': [
                    'match',
                    ['get', 'iso3'],
                    ...uniqueCountries.flatMap(
                        (country) => [
                            country.iso3.toUpperCase(),
                            COLOR_PRIMARY_RED,
                        ],
                    ),
                    COLOR_LIGHT_GREY,
                ],
            },
            layout: {
                visibility: 'visible',
            },
        };
    }, [countryResponse]);

    const handleAlertClick = useCallback(
        (id: string | undefined) => {
            setActiveAlertId(id);
            onActiveCountryChange(undefined);
        }, [onActiveCountryChange],
    );

    return (
        <Container
            className={_cs(styles.alertMap, className)}
            heading={strings.mapHeading}
            withHeaderBorder
            childrenContainerClassName={styles.mainContent}
            actions={(
                // TODO: Add sources link
                <Link
                    className={styles.sources}
                    to="/"
                >
                    {strings.mapViewAllSources}
                </Link>
            )}
            filters={(
                <Filters
                    countries={countryResponse?.public?.allCountries}
                    value={filters}
                    onChange={setFilters}
                    urgencyList={alertEnumsResponse?.enums?.AlertInfoUrgency}
                    severityList={alertEnumsResponse?.enums?.AlertInfoSeverity}
                    certaintyList={alertEnumsResponse?.enums?.AlertInfoCertainty}
                />
            )}
        >
            <BaseMap
                baseLayers={(
                    <MapLayer
                        layerKey="admin-0"
                        layerOptions={countryFillOptions}
                        hoverable
                        onClick={handleCountryClick}
                    />
                )}
            >
                <MapContainer
                    className={styles.mapContainer}
                />
                {clickedPointProperties?.lngLat && (
                    <MapPopup
                        onCloseButtonClick={handlePointClose}
                        coordinates={clickedPointProperties.lngLat}
                        heading="Map"
                        contentViewType="vertical"
                        childrenContainerClassName={styles.popupContent}
                    >
                        Map
                    </MapPopup>
                )}
                {boundsSafe && (
                    <MapBounds
                        duration={DURATION_MAP_ZOOM}
                        bounds={boundsSafe}
                        padding={DEFAULT_MAP_PADDING}
                    />
                )}
            </BaseMap>
            <Container
                className={styles.countries}
                childrenContainerClassName={styles.content}
                withInternalPadding
                heading={strings.ongoingAlertCountries}
                headingLevel={4}
                withHeaderBorder
                contentViewType="vertical"
                actions={isDefined(activeCountryId) && (
                    <Button
                        name={undefined}
                        onClick={setActiveCountryIdSafe}
                        variant="tertiary"
                        icons={(
                            <ChevronLeftLineIcon className={styles.icon} />
                        )}
                    >
                        {strings.backToAlertsLabel}
                    </Button>
                )}
            >
                {isDefined(countryResponse) && isNotDefined(activeCountryId) && isNotDefined(activeAlertId) && (
                    <List
                        className={styles.countryList}
                        filtered={false}
                        pending={countryLoading}
                        errored={false}
                        data={filteredCountries}
                        keySelector={countryKeySelector}
                        renderer={CountryListItem}
                        rendererParams={countryListRendererParams}
                        emptyMessage="No data found"
                    />
                )}

                {isDefined(activeCountryId) && (
                    <Tabs
                        value={activeLearnOption}
                        onChange={setActiveLearnOption}
                        variant="vertical-compact"
                    >
                        <TabList
                            className={styles.optionList}
                            contentClassName={styles.optionListContent}
                        >
                            <Tab
                                name="admin-1"
                                className={styles.option}
                            >
                                Admin-1
                            </Tab>
                            <Tab
                                name="alerts"
                                className={styles.option}
                            >
                                Alerts
                            </Tab>

                        </TabList>
                        <div className={styles.optionBorder} />
                        <TabPanel
                            name="admin-1"
                            className={styles.optionDetail}
                        >
                            {isDefined(activeCountryId) && (
                                <RegionListItem
                                    countryId={activeCountryId}
                                />
                            )}
                        </TabPanel>
                        <TabPanel
                            name="alerts"
                            className={styles.optionDetail}
                        >
                            {isDefined(activeCountryId) && (
                                <AlertListItem
                                    countryId={activeCountryId}
                                    activeAlertId={activeAlertId}
                                    handleAlertClick={handleAlertClick}
                                />
                            )}
                        </TabPanel>
                    </Tabs>
                )}
            </Container>
        </Container>
    );
}

export default OngoingAlertMap;
