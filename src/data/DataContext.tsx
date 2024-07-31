import { createContext, createResource, mergeProps, useContext } from 'solid-js';
import createLocalStorageSignal from '../utils/createLocalStorageSignal.tsx';
import { formatDate } from 'date-fns';
import { useTranslation } from '../utils/useTranslation.tsx';
import { useSearchParams } from '@solidjs/router';

export interface IArtist {
    slug: string;
    name: string;
    label?: string;
    genre: string;
    url?: string;
    description: string;
    imageUrl?: string;
}

export interface ILocation {
    slug: string;
    name: string;
    description?: string;
    coordinates?: [number, number];
    locationType?: string;
}

export interface ISession {
    slug: string;
    name: string;

    date: string;
    timeStart: string;
    timeEnd: string;

    dateStart: string;
    dateEnd: string;
    duration: number;

    artist?: IArtist;
    location?: ILocation;
}

export interface IDataStore {
    loading: () => boolean;
    error: () => any;
    timestamp: () => number;

    artists: () => IArtist[];
    locations: () => ILocation[];
    sessions: () => ISession[];

    filterLiked: () => boolean;
    likedArtists: () => string[];

    setFilterLiked: (value: boolean) => void;
    setLikedArtists: (value: string[]) => void;
}

const DataContext = createContext<IDataStore>({
    loading: () => false,
    error: () => undefined,

    artists: () => [],
    locations: () => [],
    sessions: () => [],
    filterLiked: () => false,
    likedArtists: () => [],

    setFilterLiked: () => {},
    setLikedArtists: () => {},

    timestamp: () => 0,
});

const preloadImage = (src: string) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = reject;
        image.src = src;
    });

const preloadImages = (imageUrls: string[]) => {
    return Promise.all(imageUrls.map(preloadImage));
};

const fetchData = async (props: { locale: string }) => {
    const merged = mergeProps({ locale: 'de', forceRefetch: false }, props);

    // first check if already cached in local storage
    const cachedData = localStorage.getItem('data');
    const parsedData = cachedData ? JSON.parse(cachedData) : undefined;

    if (!merged.forceRefetch && parsedData) {
        // if data is less than 1 hour old, use it
        if (Date.now() - parsedData.timestamp < 1000 * 60 * 60 && merged.locale === parsedData.locale) {
            console.debug('Using cached data');
            return parsedData;
        }
    }

    console.debug('Fetching data from API');

    let remoteData;
    try {
        remoteData = await fetch(`https://saegewerk-festival.de/${merged.locale}/api/`);
        remoteData = await remoteData.json();
    } catch (e) {
        console.error('Error fetching data:', e);
        if (parsedData) {
            console.debug('Fallback to cached data');
            return parsedData;
        }
        throw e;
    }

    const artists: IArtist[] = remoteData.artists;
    const locations: ILocation[] = remoteData.locations.map((location: any) => {
        return {
            slug: location.slug,
            name: location.name,
            description: location.description,
            coordinates: location.coordinates,
            locationType: location.locationType,
        };
    });
    const sessions: ISession[] = remoteData.sessions.map((session: any) => {
        const artist = artists.find((a) => a.slug === session.artist);
        const location = locations.find((l) => l.slug === session.location);

        const start = new Date(session.start);
        const end = new Date(session.end);

        return {
            slug: session.artist,
            name: session.name,
            date: formatDate(start, 'yyyy-MM-dd'),
            timeStart: formatDate(start, 'HH:mm'),
            timeEnd: formatDate(end, 'HH:mm'),
            dateStart: session.start,
            dateEnd: session.end,
            // in hours
            duration: (end.getTime() - start.getTime()) / 1000 / 60 / 60,
            artist: artist,
            location: location,
        };
    });

    // cache in local storage
    const data = { artists, locations, sessions, timestamp: Date.now(), locale: merged.locale };
    localStorage.setItem('data', JSON.stringify(data));

    // Prefetch images
    const imageUrls = artists.map((a) => a.imageUrl || '').filter(Boolean);
    void preloadImages(imageUrls);

    return data;
};

export const DataProvider = (props: any) => {
    const { language } = useTranslation();

    const [searchParams] = useSearchParams();

    const [data] = createResource(
        () => ({ locale: language(), forceRefetch: searchParams?.forceRefetch !== undefined }),
        fetchData
    );

    const [filterLiked, setFilterLiked] = createLocalStorageSignal<boolean>('filterLiked', false);
    const [likedArtists, setLikedArtists] = createLocalStorageSignal<string[]>('likedArtists', []);

    const store = {
        loading: () => data.loading,
        error: () => data.error,

        data,

        artists: () => data()?.artists || [],
        locations: () => data()?.locations || [],
        sessions: () => data()?.sessions || [],
        timestamp: () => data()?.timestamp || 0,

        filterLiked,
        likedArtists,
        setFilterLiked,
        setLikedArtists,
    };

    return <DataContext.Provider value={store}>{props.children}</DataContext.Provider>;
};

export function useData() {
    return useContext(DataContext);
}
