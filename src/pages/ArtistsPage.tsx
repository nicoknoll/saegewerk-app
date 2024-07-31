import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartFilled, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

import Fa from 'solid-fa';
import { useSearchParams } from '@solidjs/router';
import { classnames } from '../utils/classnames.ts';
import { useData } from '../data/DataContext.tsx';
import Page from '../components/Page.tsx';
import Text from '../components/Text.tsx';
import { ForwardLink } from '../components/BackLink.tsx';
import useRestorableScroll from '../utils/useRestorableScroll.tsx';
import { useTranslation } from '../utils/useTranslation.tsx';

const ArtistItem = (props: { artist: any; liked?: boolean; onLikeClicked: any }) => {
    return (
        <div class="relative w-full group">
            <ForwardLink
                class={classnames(
                    'block font-item rounded-lg p-3 w-full transition-colors ',
                    props.liked ? 'bg-brand-yellow' : 'group-hover:bg-black/10'
                )}
                href={`/artists/${props.artist.slug}`}
            >
                <Text class="hyphens-auto">{props.artist.name}</Text>
            </ForwardLink>
            <button class={classnames('absolute right-0 top-0 bottom-0 px-4')} onClick={props.onLikeClicked}>
                <Fa icon={props.liked ? faHeartFilled : faHeart} />
            </button>
        </div>
    );
};

const LanguageButton = (props: { children: any; active?: boolean; onClick: any }) => {
    return (
        <button
            class={classnames(
                'rounded-full px-2 transition-colors',
                props.active ? 'bg-brand-yellow text-black font-bold' : 'hover:bg-black/10'
            )}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
};

const AppStatus = (props: { timestamp: number }) => {
    const { t, language, onLanguageChange } = useTranslation('artistsPage.appStatus');

    return (
        <div class="text-sm text-black/30 text-center flex gap-1 flex-col py-4">
            <div class="flex gap-1 flex-wrap items-center justify-center">
                <span>
                    <Text>{t('language')}:</Text>
                </span>

                <LanguageButton onClick={() => onLanguageChange('de')} active={language() === 'de'}>
                    <Text>Deutsch</Text>
                </LanguageButton>
                <span>/</span>
                <LanguageButton onClick={() => onLanguageChange('en')} active={language() === 'en'}>
                    <Text>English</Text>
                </LanguageButton>
            </div>
            <div class="flex gap-1 flex-wrap items-center justify-center">
                <span>
                    <Text>{t('lastUpdate')}: </Text>
                </span>
                <span>
                    <Text>
                        {new Date(props.timestamp).toLocaleString(undefined, {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        })}
                    </Text>
                </span>
            </div>
            <div class="flex gap-1 flex-wrap items-center justify-center">
                <span>
                    <Text>{t('version')} </Text>
                </span>
                <span>
                    <Text>{APP_VERSION}</Text>
                </span>
                <span>
                    {navigator.onLine ? (
                        <>
                            <span class="text-lime-600">&bull;</span> <Text>{t('online')}</Text>
                        </>
                    ) : (
                        <>
                            <span class="text-red-500">&bull;</span> <Text>{t('offline')}</Text>
                        </>
                    )}
                </span>
            </div>
            <div class="flex gap-1 flex-wrap items-center justify-center"></div>
        </div>
    );
};

const ArtistsPage = () => {
    const { t } = useTranslation('artistsPage');

    const { artists, likedArtists, setLikedArtists, filterLiked, setFilterLiked, timestamp, loading } = useData();

    const { onScrollRefChange, onScroll } = useRestorableScroll();

    const [searchParams, setSearchParams] = useSearchParams() as any;
    const search = () => searchParams?.q || '';
    const setSearch = (value: string) => setSearchParams({ q: value });

    const onLikeClicked = (artist: any) => {
        if (likedArtists().includes(artist.slug)) {
            setLikedArtists(likedArtists().filter((slug) => slug !== artist.slug));
        } else {
            setLikedArtists([...likedArtists(), artist.slug]);
        }
    };

    const groupedArtists = () => {
        let filteredArtists = filterLiked()
            ? artists().filter((artist) => likedArtists().includes(artist.slug))
            : artists();
        if (search()) {
            filteredArtists = filteredArtists.filter((artist) =>
                artist.name.toLowerCase().includes(search().toLowerCase())
            );
        }
        filteredArtists.sort((a, b) => a.name.localeCompare(b.name));

        // group by first letter or symbol / number as one group #
        const groupedArtists: any = {};
        for (const artist of filteredArtists) {
            let group = artist.name[0].toUpperCase();
            if (!group.match(/[A-Z]/)) {
                group = '#';
            }
            if (!groupedArtists[group]) {
                groupedArtists[group] = [];
            }
            groupedArtists[group].push(artist);
        }

        return groupedArtists;
    };

    return (
        <Page title={t('title')} themeColor="#36CE8C" loading={loading()}>
            <main
                ref={onScrollRefChange}
                class="px-4 pt-4 pb-20 flex flex-col gap-4 bg-brand-green overflow-auto h-[100vh]"
                onScroll={onScroll}
            >
                <div class="flex gap-4">
                    <div class="relative flex-1">
                        <input
                            class={classnames(
                                'w-full rounded-full py-3 px-5 transition-colors',
                                'bg-black/10 placeholder:text-black/50 focus:bg-white/10'
                            )}
                            type="text"
                            placeholder={t('search')}
                            value={search()}
                            onInput={(e) => setSearch(e.target.value)}
                        />
                        <button
                            class="absolute right-0 top-0 bottom-0 px-4 z-10 rounded-full opacity-50 hover:opacity-100 transition-opacity"
                            onClick={() => setSearch('')}
                        >
                            {search() ? <Fa icon={faXmark} /> : <Fa icon={faMagnifyingGlass} />}
                        </button>
                    </div>

                    <button
                        class={classnames(
                            'px-4 flex-0 rounded-full transition-colors',
                            filterLiked() ? 'bg-brand-yellow' : 'hover:bg-black/10'
                        )}
                        onClick={() => setFilterLiked(!filterLiked())}
                    >
                        <Fa icon={filterLiked() ? faHeartFilled : faHeart} />
                    </button>
                </div>

                <div class="flex flex-col gap-1">
                    {Object.entries(groupedArtists()).map(([groupKey, group]: any) => (
                        <div class="flex flex-col gap-1">
                            <span class="block rounded-full uppercase font-medium text-sm text-brand-yellow bg-black/90 backdrop-blur px-3 py-1 sticky top-0 z-10">
                                <Text>{groupKey}</Text>
                            </span>
                            <div class="flex flex-col gap-1">
                                {group.map((artist: any) => (
                                    <ArtistItem
                                        artist={artist}
                                        liked={likedArtists().includes(artist.slug)}
                                        onLikeClicked={() => onLikeClicked(artist)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <AppStatus timestamp={timestamp()} />
            </main>
        </Page>
    );
};

export default ArtistsPage;
