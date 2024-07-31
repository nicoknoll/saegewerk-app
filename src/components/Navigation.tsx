import { A } from '@solidjs/router';
import { classnames } from '../utils/classnames.ts';
import { ARTISTS_PATH, MAP_PATH, TIMETABLE_PATH } from '../constants.ts';
import Text from './Text.tsx';
import { useTranslation } from '../utils/useTranslation.tsx';
import MapIcon from '../../public/map.svg';
import LineupIcon from '../../public/lineup.svg';
import TimetableIcon from '../../public/timetable.svg';

const NavigationItem = (props: any) => {
    return (
        <A
            class={classnames(
                'flex items-center justify-center gap-2 rounded-full px-3.5 py-2 font-medium transition-colors text-brand-yellow group touch-manipulation'
            )}
            activeClass="bg-brand-yellow !text-black shadow-sm"
            inactiveClass="hover:bg-white/10"
            href={props.href}
        >
            {props.children}
        </A>
    );
};

const Navigation = () => {
    const ctx = useTranslation('navigation');

    return (
        <nav class="fixed left-1/2 rounded-full bg-neutral-900 backdrop-blur p-1 gap-1 flex transform -translate-x-1/2 z-50 bottom-6 font-title uppercase text-sm font-headline">
            <NavigationItem href={ARTISTS_PATH}>
                <span class="max-xs:hidden">
                    <LineupIcon />
                </span>{' '}
                <Text class="font-headline">{ctx.t('artists')}</Text>
            </NavigationItem>

            <NavigationItem href={TIMETABLE_PATH}>
                <span class="max-xs:hidden">
                    <TimetableIcon />
                </span>{' '}
                <Text class="font-headline">{ctx.t('timetable')}</Text>
            </NavigationItem>

            <NavigationItem href={MAP_PATH}>
                <span class="max-xs:hidden">
                    <MapIcon />
                </span>{' '}
                <Text class="font-headline">{ctx.t('map')}</Text>
            </NavigationItem>
        </nav>
    );
};

export default Navigation;
