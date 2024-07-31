import { Accessor, createEffect, createSignal } from 'solid-js';
import Fa from 'solid-fa';
import { faHeart as faHeartFilled } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faUser } from '@fortawesome/free-regular-svg-icons';
import { classnames } from '../utils/classnames.ts';
import { ILocation, ISession, useData } from '../data/DataContext.tsx';
import { useSearchParams } from '@solidjs/router';
import Page from '../components/Page.tsx';
import { url } from '../utils/link.ts';
import { ARTIST_PATH, LOCATION_PATH } from '../constants.ts';
import Text from '../components/Text.tsx';
import { ForwardLink } from '../components/BackLink.tsx';
import useRestorableScroll from '../utils/useRestorableScroll.tsx';
import { useTranslation } from '../utils/useTranslation.tsx';

const COLUMN_WIDTH = 192;

function getDays(startDate: Date, endDate: Date) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate));
        // Use UTC date to prsession problems with time zones and DST
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return dateArray;
}

const Day = (props: { active: boolean; onClick: () => void; children: any }) => (
    <button
        class={classnames(
            'flex items-center justify-center gap-2 rounded-full px-3.5 py-2 font-medium transition-colors font-title uppercase text-sm font-headline touch-manipulation',
            props.active
                ? 'bg-brand-yellow shadow-sm text-black'
                : 'hover:bg-white/10 active:bg-white/10 focus:bg-white/10 text-brand-yellow'
        )}
        onClick={props.onClick}
    >
        {props.children}
    </button>
);

const DaysNavigation = (props: { children: any }) => (
    <nav class="fixed left-1/2 rounded-full bg-neutral-900 backdrop-blur p-1 gap-1 flex transform -translate-x-1/2 z-50 bottom-20 font-title uppercase text-sm font-headline">
        {props.children}
    </nav>
);

const SessionItem = (props: { session: ISession; dayOffset?: number; liked?: boolean; highlighted?: boolean }) => {
    return (
        <ForwardLink
            class={classnames(
                'absolute flex flex-col p-2.5 rounded-lg bg-brand-green gap-1 shadow-sm cursor-pointer transition-all hover:shadow-md touch-manipulation',
                !props.session.artist && 'pointer-sessions-none bg-brand-green-alt',
                props.highlighted ? 'bg-white' : props.liked ? 'bg-brand-yellow' : 'hover:opacity-80'
            )}
            style={{
                left: `${((props.dayOffset || 0) * 24 + parseInt(props.session.timeStart.split(':')[0]) + parseInt(props.session.timeStart.split(':')[1]) / 60) * COLUMN_WIDTH + 1}px`,
                width: `${props.session.duration * COLUMN_WIDTH - 2}px`,
            }}
            href={props.session.artist ? url(ARTIST_PATH, { artistId: props.session.artist.slug }) : ''}
        >
            <div class="font-item leading-none truncate">
                <Text>{props.session.name}</Text>
            </div>
            <div class="opacity-50 leading-none text-sm truncate">
                <Text>
                    {props.session.timeStart} - {props.session.timeEnd}
                </Text>
                {props.session.artist && <Fa icon={faUser} class="inline-block ml-1 text-xs" />}
            </div>
        </ForwardLink>
    );
};

const TimetablePage = () => {
    const { t, language } = useTranslation('timetablePage');

    const { scrollRef, onScrollRefChange, onScroll, initialScrollLeft } = useRestorableScroll();

    // @ts-ignore
    const dragScrollProps = useDragScroll(scrollRef);
    const [activeDay, setActiveDay] = createSignal(0);
    const [searchParams] = useSearchParams();

    const { sessions, locations, filterLiked, setFilterLiked, likedArtists, loading } = useData();

    const firstDay = () => {
        const sortedSessions = sessions().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return sortedSessions.length > 0 ? new Date(sortedSessions[0].date) : new Date();
    };

    const lastDay = () => {
        const sortedSessions = sessions().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return sortedSessions.length > 0 ? new Date(sortedSessions[sortedSessions.length - 1].date) : new Date();
    };

    const hour = 60 * 60 * 1000;
    const days = () => getDays(firstDay(), lastDay());
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const markerPosition = () =>
        (new Date().getTime() - firstDay().getTime() - new Date().getTimezoneOffset() * 1000 * 60) / hour;

    const handleScroll = () => {
        setActiveDay(Math.floor(((scrollRef()?.scrollLeft || 0) + COLUMN_WIDTH) / (24 * COLUMN_WIDTH)));
        onScroll();
    };

    createEffect(() => {
        if (initialScrollLeft) return;

        // if session is in search params, scroll to it
        if (searchParams?.session) {
            const session = sessions().find((session) => session.slug === searchParams?.session);

            if (session) {
                scrollRef()?.scrollTo({
                    left:
                        ((new Date(session.date).getTime() - firstDay().getTime()) / hour +
                            parseInt(session.timeStart.split(':')[0]) +
                            parseInt(session.timeStart.split(':')[1]) / 60 +
                            session.duration / 2) *
                            COLUMN_WIDTH -
                        window.innerWidth / 2,
                });
            }
        }

        // if current time is invalid and no search, scroll to first session
        else if (markerPosition() < 0) {
            const firstSession = sessions()?.sort(
                (a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()
            )[0];

            if (firstSession) {
                scrollRef()?.scrollTo({
                    left:
                        ((new Date(firstSession.date).getTime() - firstDay().getTime()) / hour +
                            parseInt(firstSession.timeStart.split(':')[0]) +
                            parseInt(firstSession.timeStart.split(':')[1]) / 60 +
                            firstSession.duration / 2) *
                            COLUMN_WIDTH -
                        window.innerWidth / 2,
                });
            }
        }

        // by default, scroll to current time
        else {
            scrollRef()?.scrollTo({
                left: markerPosition() * COLUMN_WIDTH - window.innerWidth / 2,
            });
        }
    });

    const sessionsByLocation = (): Record<string, ISession[]> => {
        const sessionsByLocation: Record<string, ISession[]> = {};
        sessions().forEach((session) => {
            if (!session.location?.slug || (filterLiked() && !likedArtists().includes(session.artist?.slug!))) return;

            if (!sessionsByLocation[session.location.slug]) {
                sessionsByLocation[session.location.slug] = [];
            }
            sessionsByLocation[session.location.slug].push(session);
        });
        return sessionsByLocation;
    };

    const locationsWithSessions = (): ILocation[] =>
        locations().filter((location) => sessionsByLocation()[location.slug]);

    return (
        <Page title={t('title')} themeColor="#000000" loading={loading()}>
            <main
                ref={onScrollRefChange}
                onScroll={handleScroll}
                {...dragScrollProps}
                class={classnames(
                    'bg-black h-[100dvh] overflow-x-auto overflow-y-auto relative',
                    dragScrollProps.class()
                )}
            >
                <div class="grid min-h-full">
                    <div class="flex" style={{ 'grid-row': 1, 'grid-column': 1 }}>
                        {days().map((day) =>
                            hours.map((hour) => (
                                <div
                                    class="border-r border-neutral-800 border-solid py-2 px-3 flex-none"
                                    style={{ width: `${COLUMN_WIDTH}px` }}
                                >
                                    <span class="text-neutral-400 text-sm sticky left-3 top-3">
                                        <Text>
                                            {day.toLocaleDateString(undefined, { weekday: 'short' })},{' '}
                                            {hour.toString().padStart(2, '0')}:00
                                        </Text>
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <div class="flex flex-col w-full pb-36 mt-14" style={{ 'grid-row': 1, 'grid-column': 1 }}>
                        {locationsWithSessions().map((location) => (
                            <div class="flex flex-col gap-2 items-start relative py-3 group">
                                <ForwardLink
                                    href={url(LOCATION_PATH, { locationId: location.slug })}
                                    class="inset-0 block absolute group-hover:bg-neutral-500/20 transition-all"
                                />

                                <span class="rounded-full bg-neutral-700/70 backdrop-blur px-2 py-0.5 text-neutral-200 text-xs font-medium sticky left-3 group-hover:bg-brand-yellow group-hover:text-black pointer-sessions-none transition-all uppercase font-headline">
                                    <Text>{location.name}</Text>
                                </span>

                                <div class="relative h-24 flex">
                                    {sessionsByLocation()[location.slug]?.map((session: any) => (
                                        <SessionItem
                                            session={session}
                                            liked={likedArtists().includes(session.artist?.slug)}
                                            dayOffset={
                                                (new Date(session.date).getTime() - firstDay().getTime()) /
                                                (1000 * 60 * 60 * 24)
                                            }
                                            highlighted={searchParams?.session === session.slug}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        class="h-full border-r-4 border-solid border-brand-yellow absolute"
                        style={{
                            left: `${markerPosition() * COLUMN_WIDTH}px`,
                        }}
                    ></div>
                </div>

                <button
                    class={classnames(
                        'fixed right-4 top-4 p-4 rounded-full bg-neutral-700/50 backdrop-blur text-white',
                        filterLiked() ? 'bg-brand-yellow text-black' : 'hover:bg-neutral-700'
                    )}
                    onClick={() => setFilterLiked(!filterLiked())}
                >
                    <Fa icon={filterLiked() ? faHeartFilled : faHeart} />
                </button>

                <DaysNavigation>
                    {days().map((day, index) => (
                        <Day
                            active={index === activeDay()}
                            onClick={() =>
                                scrollRef()?.scrollTo({ left: index * 24 * COLUMN_WIDTH, behavior: 'smooth' })
                            }
                        >
                            <Text>{day.toLocaleDateString(language(), { weekday: 'long' })}</Text>
                        </Day>
                    ))}
                </DaysNavigation>
            </main>
        </Page>
    );
};

const useDragScroll = (ref: Accessor<any>) => {
    const [isDragging, setIsDragging] = createSignal(false);
    const [startX, setStartX] = createSignal(0);
    const [scrollLeft, setScrollLeft] = createSignal(0);

    const handleMouseDown = (e: any) => {
        if (!ref()) return;

        setIsDragging(true);
        setStartX(e.pageX);
        setScrollLeft(ref().scrollLeft);
    };

    const handleMouseMove = (e: any) => {
        if (!ref()) return;

        if (isDragging()) {
            ref().scrollLeft = scrollLeft() - e.pageX + startX();
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return {
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        class: () => classnames(isDragging() ? 'cursor-grabbing' : 'cursor-grab'),
    };
};
export default TimetablePage;
