import { createEffect, createSignal } from 'solid-js';
import { useLocation } from '@solidjs/router';
import useLocationState from './useLocationState.tsx';
import createDebounce from '@solid-primitives/debounce';

const useRestorableScroll = () => {
    const [scrollRef, setScrollRef] = createSignal<HTMLElement | null>(null);
    const location = useLocation() as any;
    const [_, setLocationState] = useLocationState();
    const debouncedSetLocationState = createDebounce(setLocationState, 100);

    // remove reactivity
    const initialScrollLeft = location.state?.scrollLeft || 0;
    const initialScrollTop = location.state?.scrollTop || 0;

    const handleScroll = () => {
        debouncedSetLocationState({
            scrollLeft: scrollRef()?.scrollLeft,
            scrollTop: scrollRef()?.scrollTop,
        });
    };

    createEffect(() => {
        if (!scrollRef()) return;
        scrollRef()?.scrollTo({ left: initialScrollLeft, top: initialScrollTop });
    });

    return {
        scrollRef,
        onScrollRefChange: setScrollRef,
        onScroll: handleScroll,
        initialScrollLeft,
        initialScrollTop,
    };
};

export default useRestorableScroll;
