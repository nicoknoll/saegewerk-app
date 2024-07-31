import { faHeart, faUser } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faHeart as faHeartFilled } from '@fortawesome/free-solid-svg-icons';
import Fa from 'solid-fa';
import { useParams, useSearchParams } from '@solidjs/router';
import { classnames } from '../utils/classnames.ts';
import { useData } from '../data/DataContext.tsx';
import Page from '../components/Page.tsx';
import BackLink, { ForwardLink } from '../components/BackLink.tsx';
import { ARTIST_PATH, TIMETABLE_PATH } from '../constants.ts';
import { url } from '../utils/link.ts';
import Text from '../components/Text.tsx';
import { formatDate } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { createEffect } from 'solid-js';
import useRestorableScroll from '../utils/useRestorableScroll.tsx';
import { useTranslation } from '../utils/useTranslation.tsx';

const SessionItem = (props: { session: any; liked?: boolean; onLikeClicked: any; highlighted?: boolean }) => {
    return (
        <div class="relative w-full group" data-slug={props.session.slug}>
            <ForwardLink
                class={classnames(
                    'block font-medium rounded-lg p-3 w-full transition-colors font-title ',
                    props.highlighted ? 'bg-white' : props.liked ? 'bg-brand-yellow' : 'group-hover:bg-black/10',
                    !props.session.artist && 'pointer-sessions-none group-hover:bg-transparent'
                )}
                href={props.session.artist ? url(ARTIST_PATH, { artistId: props.session.artist.slug }) : ''}
            >
                <div class="font-item truncate">
                    <Text>{props.session.name}</Text>
                </div>
                <div class="opacity-50 text-sm">
                    <Text>
                        {props.session.timeStart} - {props.session.timeEnd}
                    </Text>
                    {props.session.artist && <Fa icon={faUser} class="inline-block ml-1 text-xs" />}
                </div>
            </ForwardLink>
            {props.session.artist && (
                <button class="absolute right-0 top-0 bottom-0 px-4" onClick={props.onLikeClicked}>
                    <Fa icon={props.liked ? faHeartFilled : faHeart} />
                </button>
            )}
        </div>
    );
};

const LocationPage = () => {
    const { language } = useTranslation();
    const { likedArtists, setLikedArtists, filterLiked, setFilterLiked, locations, sessions, loading } = useData();

    const { locationId: locationSlug } = useParams();

    const { scrollRef, onScrollRefChange, onScroll, initialScrollTop } = useRestorableScroll();

    const [searchParams] = useSearchParams() as any;

    createEffect(() => {
        if (!sessions() || initialScrollTop) return;
        // if session is in search params, scroll to it
        else if (searchParams?.session) {
            const session = sessions().find((session) => session.slug === searchParams?.session);
            const sessionNode = scrollRef()?.querySelector(`[data-slug="${searchParams?.session}"]`);

            if (session && sessionNode) {
                sessionNode?.scrollIntoView({ block: 'center' });
            }
        }
    });

    const handleLikeClicked = (artist: any) => {
        if (likedArtists().includes(artist.slug)) {
            setLikedArtists(likedArtists().filter((slug) => slug !== artist.slug));
        } else {
            setLikedArtists([...likedArtists(), artist.slug]);
        }
    };

    const location = () => locations().find((location) => location.slug === locationSlug);

    const groupedSessions = () => {
        let filteredSessions = filterLiked()
            ? sessions().filter((session) => likedArtists().includes(session.artist?.slug!))
            : sessions();
        filteredSessions = filteredSessions.filter((session) => session.location?.slug === locationSlug);
        // sort by date and start time
        filteredSessions.sort((a, b) => {
            if (a.date !== b.date) {
                return a.date.localeCompare(b.date);
            }
            return a.timeStart.localeCompare(b.timeStart);
        });

        // group by date
        const groupedSessions: any = {};
        for (const session of filteredSessions) {
            if (!groupedSessions[session.date]) {
                groupedSessions[session.date] = [];
            }
            groupedSessions[session.date].push(session);
        }

        return groupedSessions;
    };

    return (
        <Page title={location()?.name} themeColor="#36CE8C" loading={loading()}>
            <main
                class="px-4 pt-4 pb-20 flex flex-col gap-2 bg-brand-green overflow-auto h-[100vh]"
                onScroll={onScroll}
                ref={onScrollRefChange}
            >
                <div class="flex justify-between w-full">
                    <BackLink
                        class={classnames('p-4 flex-0 rounded-full transition-colors', 'hover:bg-neutral-100')}
                        href={TIMETABLE_PATH}
                    >
                        <Fa icon={faArrowLeft} />
                    </BackLink>

                    <button
                        class={classnames(
                            'px-4 flex-0 rounded-full transition-colors',
                            filterLiked() ? 'bg-brand-yellow' : 'hover:bg-neutral-100'
                        )}
                        onClick={() => setFilterLiked(!filterLiked())}
                    >
                        <Fa icon={filterLiked() ? faHeartFilled : faHeart} />
                    </button>
                </div>

                <div class="flex flex-col gap-6">
                    <h1 class="text-2xl font-medium font-headline uppercase">
                        <Text>{location()?.name}</Text>
                    </h1>

                    <div class="flex flex-col gap-1">
                        {Object.entries(groupedSessions()).map(([groupKey, group]: any) => (
                            <div class="flex flex-col gap-1">
                                <span class="block rounded-full uppercase font-medium text-sm text-brand-yellow bg-black/90 backdrop-blur px-3 py-1 sticky top-0 z-10">
                                    <Text>
                                        {formatDate(new Date(groupKey), 'EEEE', {
                                            locale: language() === 'de' ? de : enUS,
                                        })}
                                    </Text>
                                </span>

                                <div class="flex flex-col gap-1">
                                    {group.map((session: any) => (
                                        <SessionItem
                                            session={session}
                                            liked={likedArtists().includes(session.artist?.slug)}
                                            onLikeClicked={() => handleLikeClicked(session?.artist)}
                                            highlighted={searchParams?.session === session.slug}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </Page>
    );
};

export default LocationPage;
