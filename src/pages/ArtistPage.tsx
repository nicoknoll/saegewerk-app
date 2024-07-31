import { faArrowLeft, faArrowRight, faBars, faHeart as faHeartFilled, faLink } from '@fortawesome/free-solid-svg-icons';
import Fa from 'solid-fa';
import { faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import { classnames } from '../utils/classnames.ts';
import { faCalendar, faHeart } from '@fortawesome/free-regular-svg-icons';
import { useParams } from '@solidjs/router';
import { IArtist, ISession, useData } from '../data/DataContext.tsx';
import Page from '../components/Page.tsx';
import NotFoundPage from './NotFoundPage.tsx';
import BackLink, { ForwardLink } from '../components/BackLink.tsx';
import { ARTISTS_PATH, LOCATION_PATH, TIMETABLE_PATH } from '../constants.ts';
import { url } from '../utils/link.ts';
import { createSignal, Show } from 'solid-js';
import Text from '../components/Text.tsx';
import { useTranslation } from '../utils/useTranslation.tsx';

const Session = (props: { session: ISession }) => {
    const { language } = useTranslation();

    return (
        <div class="flex flex-col gap-2 items-start">
            <ForwardLink
                href={`${TIMETABLE_PATH}?session=${props.session.slug}`}
                class="rounded-lg bg-brand-yellow py-3 px-4 font-item flex gap-3 items-center hover:bg-neutral-400 transition-colors"
            >
                <Fa icon={faCalendar} />
                <Text>
                    {new Date(props.session.date).toLocaleDateString(language(), {
                        weekday: 'long',
                    })}
                    , {props.session.timeStart} - {props.session.timeEnd}
                </Text>
                <Fa icon={faArrowRight} />
            </ForwardLink>

            <ForwardLink
                href={`${url(LOCATION_PATH, { locationId: props.session.location?.slug })}?session=${props.session.slug}`}
                class="rounded-lg bg-neutral-100 py-3 px-4 font-item flex gap-3 items-center hover:bg-neutral-400 transition-colors"
            >
                <Fa icon={faBars} />
                <Text>{props.session.location?.name}</Text>
                <Fa icon={faArrowRight} />
            </ForwardLink>
        </div>
    );
};

const ProfileImage = (props: { imageUrl?: string }) => {
    const [style, setStyle] = createSignal<any>(undefined);
    const [isLoaded, setIsLoaded] = createSignal(false);

    const handleImageClick = () => {
        if (style()) {
            // enable scroll
            document.body.style.overflow = 'auto';
            setStyle(undefined);
        } else {
            // disable scroll
            document.body.style.overflow = 'hidden';

            const padding = 8;

            // get current position of image in viewport and viewport width/height
            const rect = document.querySelector('img')?.getBoundingClientRect();
            const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) - 2 * padding;
            const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 2 * padding;

            setStyle({
                transform: `translate(-${(rect?.left || 0) - padding}px, -${(rect?.top || 0) - padding}px)`,
                width: `${width}px`,
                height: `${height}px`,
                'border-radius': '38px',
            });
        }
    };

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    return (
        <div class="w-24 h-32 rounded-lg bg-neutral-900">
            {props.imageUrl && (
                <img
                    src={props.imageUrl}
                    class={classnames(
                        'w-24 h-32 rounded-lg object-cover transition-all duration-300 origin-top-left max-w-none z-50 relative',
                        style() ? 'cursor-zoom-out' : 'cursor-zoom-in',
                        isLoaded() ? 'opacity-100' : 'opacity-0'
                    )}
                    onClick={handleImageClick}
                    style={style()}
                    onLoad={handleImageLoad}
                />
            )}
        </div>
    );
};

const Profile = (props: { artist: IArtist; session?: ISession }) => {
    return (
        <div class="w-full max-w-xl flex flex-col gap-2">
            <div class="flex flex-col gap-6">
                <div class="flex gap-4 items-center">
                    <ProfileImage imageUrl={props.artist.imageUrl} />

                    <div class="flex flex-col gap-2 min-w-0">
                        <div class="flex flex-col">
                            <h1 class="text-2xl font-medium font-headline text-white">
                                <Text class="hyphens-auto">{props.artist.name}</Text>
                            </h1>
                            {/*
                            {props.artist.label && <h2 class="text-md text-neutral-400">{props.artist.label}</h2>}
                            */}
                        </div>

                        {/*
                        {props.artist.genre && (
                            <div>
                                <span class="inline-block rounded-full bg-neutral-100 font-medium px-2">
                                    {props.artist.genre}
                                </span>
                            </div>
                        )}*/}

                        {props.artist.url &&
                            (props.artist.url?.includes('soundcloud.com') ? (
                                <a
                                    href={props.artist.url}
                                    class="text-orange-500 hover:text-orange-600 flex items-center gap-1.5 text-lg"
                                    target="_blank"
                                >
                                    <Fa icon={faSoundcloud} />{' '}
                                    <Text class="truncate">{props.artist.url?.split('/').pop()}</Text>
                                </a>
                            ) : (
                                <a
                                    href={props.artist.url}
                                    class="text-blue-500 hover:text-blue-600 flex items-center gap-1.5 text-lg truncate"
                                    target="_blank"
                                >
                                    <Fa icon={faLink} />{' '}
                                    <Text class="truncate">{props.artist.url?.split('/')[2].replace('www.', '')}</Text>
                                </a>
                            ))}
                    </div>
                </div>

                <p class="leading-7 text-white font-mono whitespace-pre-wrap">{props.artist.description}</p>

                {props.session && <Session session={props.session} />}
            </div>
        </div>
    );
};

const ArtistPage = () => {
    const { artistId: artistSlug } = useParams();
    const { artists, sessions, likedArtists, setLikedArtists, loading } = useData();

    const artist = () => artists().find((artist: IArtist) => artist.slug === artistSlug);

    const session = () => sessions().filter((session) => session.artist?.slug === artistSlug)[0];

    const isLiked = () => likedArtists().includes(artist()?.slug!);

    const toggleLiked = () => {
        if (isLiked()) {
            setLikedArtists(likedArtists().filter((slug) => slug !== artist()?.slug));
        } else {
            setLikedArtists([...likedArtists(), artist()?.slug!]);
        }
    };

    return (
        <Page title={artist()?.name} themeColor="#000000" loading={loading()}>
            <Show when={artist()} fallback={<NotFoundPage />}>
                <main class="px-4 pt-4 pb-28 flex flex-col gap-2 items-center">
                    <div class="flex justify-between w-full">
                        <BackLink
                            class={classnames(
                                'p-4 flex-0 rounded-full transition-colors text-white',
                                'hover:bg-white/10'
                            )}
                            href={ARTISTS_PATH}
                        >
                            <Fa icon={faArrowLeft} />
                        </BackLink>

                        <button
                            class={classnames(
                                'p-4 flex-0 rounded-full transition-colors text-white',
                                isLiked() ? 'bg-brand-yellow text-black' : 'hover:bg-white/10'
                            )}
                            onClick={toggleLiked}
                        >
                            <Fa icon={isLiked() ? faHeartFilled : faHeart} />
                        </button>
                    </div>

                    {/* @ts-ignore */}
                    <Profile artist={artist()} session={session()} />
                </main>
            </Show>
        </Page>
    );
};

export default ArtistPage;
