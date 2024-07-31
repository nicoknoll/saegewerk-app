import { createContext, createEffect, createSignal, onCleanup, onMount, splitProps, useContext } from 'solid-js';
import Page from '../components/Page.tsx';
import { ISession, useData } from '../data/DataContext.tsx';
import { classnames } from '../utils/classnames.ts';
import Fa from 'solid-fa';
import {
    faArrowRight,
    faBeer,
    faBriefcaseMedical,
    faCampground,
    faDroplet,
    faInfoCircle,
    faList,
    faLocationArrow,
    faLocationDot,
    faMicrophone,
    faMusic,
    faPalette,
    faRestroom,
    faShower,
    faSquareParking,
    faStar,
    faTheaterMasks,
    faUmbrellaBeach,
    faUtensils,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from '@solidjs/router';
import { url } from '../utils/link.ts';
import { LOCATION_PATH } from '../constants.ts';
import Text from '../components/Text.tsx';
import { ForwardLink } from '../components/BackLink.tsx';
import { Dynamic } from 'solid-js/web';
import VectorSource from 'ol/source/Vector';
import { Feature, Map as OLMap, Overlay, View } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import ImageStatic from 'ol/source/ImageStatic';
import ImageLayer from 'ol/layer/Image';
import Geolocation from 'ol/Geolocation';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { Point } from 'ol/geom';
import { useTranslation } from '../utils/useTranslation.tsx';
import { easeOut } from 'ol/easing';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import Switch from '../components/Switch.tsx';
import createLocalStorageSignal from '../utils/createLocalStorageSignal.tsx';

const INITIAL_POSITION = [51.89153912413526, 14.547410663280523];
const INITIAL_ZOOM = 18;
const FOLLOWING_ZOOM = 19;

const MAP_BOUNDS = [
    [51.89516547512937, 14.542272090911865],
    [51.88854419822313, 14.555060863494871],
];
const MAP_IMAGE_URL = '/map.png';

const fromLatLng = (latlng: any) => fromLonLat([latlng[1], latlng[0]]);

const STAGE_TYPES = ['stage'];
const GENERAL_TYPES = ['medical', 'bar', 'food', 'camping', 'parking'];
const ACTIVITY_TYPES = ['highlight', 'recreation', 'art', 'theater'];
const HYGIENE_TYPES = ['water', 'shower', 'toilet'];
const OTHER_TYPES = ['info'];

// @ts-ignore
const getMarkerIcon = (locationType: string, slug: string) => {
    if (slug === 'awareness') return faEye;
    if (slug === 'karaoke') return faMicrophone;

    if (locationType === 'stage') return faMusic;
    if (locationType === 'bar') return faBeer;
    if (locationType === 'food') return faUtensils;
    if (locationType === 'water') return faDroplet;
    if (locationType == 'shower') return faShower;
    if (locationType === 'info') return faInfoCircle;
    if (locationType === 'toilet') return faRestroom;
    if (locationType === 'camping') return faCampground;
    if (locationType === 'parking') return faSquareParking;
    if (locationType === 'medical') return faBriefcaseMedical;
    if (locationType === 'highlight') return faStar;
    if (locationType === 'recreation') return faUmbrellaBeach;
    if (locationType === 'art') return faPalette;
    if (locationType === 'theater') return faTheaterMasks;
    return faLocationDot;
};

// @ts-ignore
const getMarkerColor = (locationType: string, slug: string) => {
    if (locationType === 'stage') return 'bg-red-500';
    if (locationType === 'bar') return 'bg-lime-600';
    if (locationType === 'food') return 'bg-lime-600';
    if (locationType === 'water') return 'bg-blue-500';
    if (locationType == 'shower') return 'bg-blue-500';
    if (locationType === 'info') return 'bg-gray-500';
    if (locationType === 'toilet') return 'bg-purple-600';
    if (locationType === 'camping') return 'bg-yellow-500';
    if (locationType === 'parking') return 'bg-blue-800';
    if (locationType === 'medical') return 'bg-red-500';
    if (locationType === 'highlight') return 'bg-yellow-500';
    if (locationType === 'recreation') return 'bg-amber-600';
    if (locationType === 'art') return 'bg-yellow-500';
    if (locationType === 'theater') return 'bg-yellow-500';
    return 'bg-gray-500';
};

// @ts-ignore
const getMarkerImageUrl = (locationType: string, slug: string) => {
    if (slug === 'terminal-21') return '/map_icons/Terminal 21.svg';
    if (slug === 'radarstation') return '/map_icons/Radarstation.svg';
    if (slug === 'loschhalle') return '/map_icons/Loeschhalle.svg';
    if (slug === 'yumyum') return '/map_icons/YumYum Bar.svg';

    if (slug === 'awareness') return '/map_icons/Awareness.svg';
    if (slug === 'karaoke') return '/map_icons/Karaoke.svg';
    if (slug === 'aux-floor') return '/map_icons/AUX Floor.svg';
    if (slug === 'briefkasten') return '/map_icons/Post.svg';
    if (slug === 'ruhezelt') return '/map_icons/Ruhezelt.svg';
    if (slug === 'bunker') return '/map_icons/Bunker.svg';
    if (slug === 'wellness') return '/map_icons/Wellness.svg';
    if (slug === 'zauberwald') return '/map_icons/Zauberwald.svg';
    if (slug === 'sonnendeck') return '/map_icons/Sonnendeck.svg';
    if (slug === 'luftschloss' || slug === 'kumpelblase') return '/map_icons/Luftschloss.svg';
    if (slug === 'dorfzentrum') return '/map_icons/Dorfzentrum.svg';
    if (slug === 'gangwandler') return '/map_icons/Gangwandler.svg';
    if (slug === 'einlass') return '/map_icons/Einlass.svg';
    if (slug === 'teufelsberg') return '/map_icons/Teufelsberg.svg';
    if (slug === 'infopoint') return '/map_icons/Infopoint.svg';
    if (slug === 'merch-stand') return '/map_icons/Merch-Kiosk.svg';
    if (slug === 'tattoo') return '/map_icons/Tattoo.svg';
    if (slug === 'mullpfand') return '/map_icons/Muellpfand.svg';

    if (locationType === 'parking') return '/map_icons/Parking.svg';
    if (locationType === 'camping') return '/map_icons/Camping.svg';
    if (locationType === 'theater') return '/map_icons/Talentbuehne.svg';
    if (locationType === 'food') return '/map_icons/Essen.svg';
    if (locationType === 'medical') return '/map_icons/Sani.svg';
    if (locationType === 'toilet') return '/map_icons/Toilette.svg';
    if (locationType === 'water') return '/map_icons/Wasserstelle.svg';
    if (locationType === 'shower') return '/map_icons/Dusche.svg';
    if (locationType === 'bar') return '/map_icons/Bar.svg';
};

const MapContext = createContext<any>(null);

const Map = (props: { isFollowing?: boolean; onFollowingChange?: (following: boolean) => void; children?: any }) => {
    const [ref, setRef] = createSignal<HTMLDivElement>();
    const [map, setMap] = createSignal<any>(null);

    const [isTrackingError, setIsTrackingError] = createSignal(false);
    const [isTrackingErrorVisible, setIsTrackingErrorVisible] = createSignal(false);

    createEffect(() => {
        if (isTrackingErrorVisible()) {
            setTimeout(() => {
                setIsTrackingErrorVisible(false);
            }, 3000);
        }
    });

    createEffect(() => {
        if (isTrackingError()) {
            setIsTrackingErrorVisible(true);
            props.onFollowingChange?.(false);
            return;
        }

        if (props.isFollowing) {
            const coordinates = geolocation.getPosition();
            if (coordinates) {
                view.animate({ center: coordinates, zoom: FOLLOWING_ZOOM, duration: 100, easing: easeOut });
            }
        }
    });

    const extent = fromLatLng(MAP_BOUNDS[0]).concat(fromLatLng(MAP_BOUNDS[1]));

    const image = new ImageLayer({
        source: new ImageStatic({
            url: MAP_IMAGE_URL,
            imageExtent: [extent[0], extent[3], extent[2], extent[1]],
        }),
    });

    const view = new View({
        center: fromLatLng(INITIAL_POSITION),
        zoom: INITIAL_ZOOM,
        rotation: 0.353,
    });

    const geolocation = new Geolocation({
        // enableHighAccuracy must be set to true to have the heading value.
        trackingOptions: {
            enableHighAccuracy: true,
        },
        projection: view.getProjection(),
        tracking: true,
    });

    // handle geolocation error.
    geolocation.on('error', function () {
        positionFeature.setGeometry(undefined);
        accuracyFeature.setGeometry(undefined);
        setIsTrackingError(true);
        setIsTrackingErrorVisible(true);
    });

    const accuracyFeature = new Feature();
    geolocation.on('change:accuracyGeometry', function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry()!);
    });

    const positionFeature = new Feature();
    positionFeature.setStyle(
        new Style({
            image: new CircleStyle({
                radius: 6,
                fill: new Fill({
                    color: '#3399CC',
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 2,
                }),
            }),
        })
    );

    geolocation.on('change:position', function () {
        const coordinates = geolocation.getPosition();
        // @ts-ignore
        positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);

        if (props.isFollowing) {
            view.animate({ center: coordinates, duration: 100, easing: easeOut });
        }
    });

    const source = new VectorSource({
        wrapX: false,
        features: [accuracyFeature, positionFeature],
    });

    const vector = new VectorLayer({
        source,
    });

    const olMap = new OLMap({
        layers: [image, vector],
        target: 'map',
        view,
    });

    olMap.on('pointerdrag', () => {
        props.onFollowingChange?.(false);
    });

    setMap(olMap);

    createEffect(() => {
        map().setTarget(ref());
    });

    const [local, options] = splitProps(props, ['children']);

    return (
        <MapContext.Provider value={map}>
            {isTrackingError() && isTrackingErrorVisible() && (
                <div class="fixed z-40 top-4 left-4 right-4">
                    <div class="px-4 py-3 rounded-lg bg-red-500/70 backdrop-blur  text-white flex gap-2 items-center">
                        <Text>
                            Standort konnte nicht ermittelt werden. Bitte erlaube den Zugriff auf deinen Standort und
                            starte die App neu.
                        </Text>
                    </div>
                </div>
            )}

            <div ref={setRef} class="w-full h-full bg-transparent z-20" {...options} />
            {local.children}
        </MapContext.Provider>
    );
};

const Marker = (props: {
    latlng: any;
    icon: any;
    color: string;
    isLive?: boolean;
    active?: boolean;
    onActiveChange?: (active: boolean) => void;
    imageUrl?: string;
    locationType?: string;
}) => {
    const map = useContext(MapContext);
    // @ts-ignore
    const [marker, setMarker] = createSignal<any>(null);

    createEffect(() => {
        if (props.active) {
            map()
                ?.getView()
                .animate({ center: fromLatLng(props.latlng), duration: 100, easing: easeOut });
        }
    });

    onMount(() => {
        const rotation = Math.random() * 30 + -15;
        // Create an overlay to anchor the custom HTML element to the map
        const markerOverlay = new Overlay({
            position: fromLatLng(props.latlng),
            positioning: 'bottom-center',
            // @ts-ignore
            element: (
                <button
                    class={classnames(
                        'marker flex gap-1.5 items-center justify-center text-sm bg-black/50 backdrop-blur w-8 h-8 border border-white shadow-sm text-white [text-shadow:0_1px_0_rgb(0_0_0_/_40%)] font-medium whitespace-nowrap rounded-full absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:z-30 transition-all',
                        'hover:scale-125',
                        props.color,
                        props.locationType === 'stage' && 'w-14 h-14',
                        props.imageUrl && 'border-none bg-transparent backdrop-blur-none',
                        props.active ? 'z-30 scale-125 !outline outline-8 outline-white/80 bg-black' : 'z-20',
                        props.active && props.locationType === 'stage' && 'bg-white/80'
                    )}
                    onClick={() => {
                        props.onActiveChange?.(!props.active);
                    }}
                    style={{ filter: 'drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.2))' }}
                >
                    {props.imageUrl ? (
                        // rotate random beteen 10 degreews and -10 degrees
                        <img
                            src={props.imageUrl}
                            class={classnames(
                                'z-30 hover:!rotate-0 transition-all w-full h-full',
                                props.active && '!rotate-0'
                            )}
                            style={
                                props.locationType === 'stage'
                                    ? {
                                          transform: 'rotate(' + rotation + 'deg)',
                                      }
                                    : undefined
                            }
                        />
                    ) : (
                        props.icon && (
                            <span class="text-xs h-5 flex items-center justify-center">
                                <Fa icon={props.icon} />
                            </span>
                        )
                    )}
                    {props.isLive && (
                        <span class="flex h-3 w-3 absolute top-1 right-1 z-40">
                            <span class="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3 bg-brand-yellow shadow-lg border border-black/10"></span>
                        </span>
                    )}
                </button>
            ),
            stopEvent: false,
        });

        // Add the overlay to the map
        map()?.addOverlay(markerOverlay);
        setMarker(markerOverlay);
    });

    onCleanup(() => {
        map()?.removeOverlay(marker());
        setMarker(null);
    });

    return null;
};

const LocationName = (props: { name: string; href?: string }) => {
    return (
        <Dynamic
            component={props.href ? ForwardLink : 'div'}
            class={classnames(
                'fixed rounded-full bg-neutral-900 backdrop-blur p-1 transform z-40 bottom-20 font-title font-headline text-white text-xl flex gap-0 items-center justify-center transition-all',
                props.href && 'cursor-pointer hover:bg-neutral-700/80 hover:shadow-lg'
            )}
            href={props.href}
        >
            <Text class="px-4 py-1 text-center">{props.name}</Text>
            {props.href && (
                <span class="bg-brand-yellow rounded-full p-1 text-black w-9 h-9 flex items-center justify-center flex-none">
                    <Fa icon={faArrowRight} />
                </span>
            )}
        </Dynamic>
    );
};

const LocationList = (props: {
    onFocusedLocationKeyChange?: (key: string) => void;
    filters?: any;
    onFiltersChange?: any;
}) => {
    const { locations } = useData();
    const { t } = useTranslation('mapPage.locationList');

    const handleFilterChange = (key: string, value: boolean) => {
        props.onFiltersChange({ ...props.filters, [key]: value });
    };

    const [isOpen, setIsOpen] = createSignal(false);

    const handleClick = () => {
        setIsOpen(!isOpen());
    };

    // group by locationType GENERAL_TYPES, ACTIVITY_TYPES, HYGIENE_TYPES, STAGE_TYPES
    const getGroup = (locationType: string) => {
        if (ACTIVITY_TYPES.includes(locationType)) return 'activity';
        if (HYGIENE_TYPES.includes(locationType)) return 'hygiene';
        if (STAGE_TYPES.includes(locationType)) return 'stage';
        if (GENERAL_TYPES.includes(locationType)) return 'general';
        if (OTHER_TYPES.includes(locationType)) return 'other';
        return 'other';
    };

    const locationGroups = () => {
        const groups: any = {};
        locations().forEach((poi: any) => {
            const group = getGroup(poi.locationType);
            if (!groups[group]) groups[group] = [];
            groups[group].push(poi);
        });
        return groups;
    };

    // sort locations by name in groups
    const sortedLocationGroups = () => {
        const groups = locationGroups();
        Object.keys(groups).forEach((key) => {
            groups[key] = groups[key].sort((a: any, b: any) => a.name.localeCompare(b.name));
        });

        // groups should be stages, general, activity, hygiene, other
        const order = ['stage', 'general', 'activity', 'hygiene', 'other'];
        const sortedGroups: any = {};
        order.forEach((key) => {
            if (groups[key]) sortedGroups[key] = groups[key];
        });

        return sortedGroups;
    };

    return (
        <>
            <button
                class={classnames(
                    'fixed z-50 left-4 top-4 p-4 rounded-full bg-neutral-700/50 backdrop-blur text-white hover:bg-neutral-700 flex items-center justify-center w-12 h-12'
                )}
                onClick={handleClick}
            >
                {!Object.values(props.filters).every(Boolean) && (
                    <span class="absolute top-0.5 right-0.5 w-3 h-3 bg-brand-yellow rounded-full shadow" />
                )}
                <Fa icon={!isOpen() ? faList : faXmark} />
            </button>

            {isOpen() && (
                <div class="fixed inset-0 overflow-auto bg-black z-40">
                    <div class="flex flex-col py-20 pb-24 px-4 gap-4">
                        {Object.entries(sortedLocationGroups()).map(([groupName, pois]: any) => {
                            const isActive = () => props.filters[groupName];
                            return (
                                <div
                                    class={classnames(
                                        'flex flex-col gap-4 p-4 rounded-2xl bg-neutral-900'
                                        // isActive() ? 'bg-brand-yellow' : 'bg-neutral-900'
                                    )}
                                >
                                    <div
                                        class="text-white text-xl font-title flex items-center justify-start gap-4 cursor-pointer"
                                        onClick={() => handleFilterChange(groupName, !isActive())}
                                    >
                                        <Switch checked={isActive()} />
                                        <Text>{t(groupName)}</Text>
                                    </div>

                                    {isActive() && (
                                        <div class="flex flex-col gap-2">
                                            {pois.map((poi: any) => {
                                                const icon = getMarkerIcon(poi.locationType, poi.slug);
                                                const imageUrl = getMarkerImageUrl(poi.locationType, poi.slug);

                                                return (
                                                    <button
                                                        class={classnames(
                                                            'backdrop-blur p-4 rounded-lg flex items-center justify-between gap-2 text-black font-item hover:bg-opacity-80 transition-all bg-brand-yellow'
                                                        )}
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            props.onFocusedLocationKeyChange?.(poi.slug);
                                                        }}
                                                    >
                                                        {imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                class="w-8 h-8"
                                                                style={{
                                                                    filter: 'drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.2))',
                                                                }}
                                                            />
                                                        ) : (
                                                            <Fa icon={icon} class={classnames('text-xl')} />
                                                        )}
                                                        <Text>{poi.name}</Text>
                                                        <Fa icon={faArrowRight} class="mr-2" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
};

const MapPage = () => {
    const { t } = useTranslation('mapPage');

    const { locations, sessions, loading } = useData();

    const [isFollowing, setIsFollowing] = createSignal(false);

    const [filters, setFilters] = createLocalStorageSignal<any>('mapPage:locationList:filters', {
        activity: true,
        hygiene: true,
        stage: true,
        general: true,
        other: true,
    });

    const [searchParams, setSearchParams] = useSearchParams() as any;

    const filteredLocations = () => {
        const currentFilters = filters();
        return locations().filter((poi: any) => {
            if (!currentFilters.activity && ACTIVITY_TYPES.includes(poi.locationType)) return false;
            if (!currentFilters.hygiene && HYGIENE_TYPES.includes(poi.locationType)) return false;
            if (!currentFilters.stage && STAGE_TYPES.includes(poi.locationType)) return false;
            if (!currentFilters.general && GENERAL_TYPES.includes(poi.locationType)) return false;
            if (!currentFilters.other && OTHER_TYPES.includes(poi.locationType)) return false;
            return true;
        });
    };

    const focusedLocationKey = () => searchParams?.location || '';
    const setFocusedLocationKey = (value: string | null) => setSearchParams({ location: value });
    const focusedLocation = () => filteredLocations().find((location: any) => location.slug === focusedLocationKey());
    const focusedLocationHasSessions = () =>
        focusedLocation() &&
        sessions().filter((session: any) => session.location?.slug === focusedLocation()?.slug).length > 0;

    const focusedLocationCurrentSession = () =>
        sessions().find(
            (session: any) =>
                session.location?.slug === focusedLocation()?.slug &&
                session.dateStart < new Date() &&
                session.dateEnd > new Date()
        );

    const handleOutsideClick = (e: any) => {
        if (!e.target.closest('.marker')) {
            setFocusedLocationKey(null);
        }
    };

    return (
        <Page title={t('title')} themeColor="#000000" loading={loading()}>
            <main
                class="w-[100vw] h-[100dvh] relative z-10 bg-black flex items-center justify-center"
                onClick={handleOutsideClick}
            >
                <button
                    class={classnames(
                        'fixed z-30 right-4 top-4 p-4 rounded-full bg-neutral-700/50 backdrop-blur text-white w-12 h-12',
                        isFollowing() ? 'bg-brand-yellow text-black' : 'hover:bg-neutral-700'
                        // isTrackingError() && 'opacity-50'
                    )}
                    onClick={() => setIsFollowing(!isFollowing())}
                >
                    <Fa icon={faLocationArrow} />
                </button>

                <LocationList
                    onFocusedLocationKeyChange={(key: string) => {
                        setFocusedLocationKey(key);
                        setIsFollowing(false);
                    }}
                    filters={filters()}
                    onFiltersChange={setFilters}
                />

                <Map isFollowing={isFollowing()} onFollowingChange={setIsFollowing}>
                    {filteredLocations().map((poi: any) => {
                        const icon = getMarkerIcon(poi.locationType, poi.slug);
                        const color = getMarkerColor(poi.locationType, poi.slug);
                        const imageUrl = getMarkerImageUrl(poi.locationType, poi.slug);

                        // see if session is currently active
                        const isLive = () =>
                            sessions().some((session: ISession) => {
                                const start = new Date(session.dateStart);
                                const end = new Date(session.dateEnd);

                                return session.location?.slug === poi.slug && start < new Date() && end > new Date();
                            });

                        return (
                            <Marker
                                latlng={poi.coordinates}
                                icon={icon}
                                imageUrl={imageUrl}
                                color={color}
                                locationType={poi.locationType}
                                active={focusedLocationKey() === poi.slug}
                                onActiveChange={(active: boolean) => {
                                    setFocusedLocationKey(active ? poi.slug : null);
                                }}
                                isLive={isLive()}
                            />
                        );
                    })}
                </Map>

                {focusedLocationCurrentSession() && (
                    <div class="fixed transform z-40 top-20 px-4">
                        <div class="rounded-full bg-black/90 backdrop-blur px-6 py-4 font-title font-headline text-white text-xl flex flex-col gap-1 items-center justify-center transition-all">
                            <Text class="text-sm text-neutral-500 block text-center">{t('currentProgram')}</Text>
                            <Text class="px-4 text-center text-balance">{focusedLocationCurrentSession()?.name}</Text>
                        </div>
                    </div>
                )}

                {focusedLocation() && (
                    <LocationName
                        name={focusedLocation()?.name || ''}
                        href={
                            focusedLocationHasSessions()
                                ? url(LOCATION_PATH, { locationId: focusedLocation()?.slug })
                                : undefined
                        }
                    />
                )}
            </main>
        </Page>
    );
};

export default MapPage;
