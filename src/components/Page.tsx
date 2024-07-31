import { useMetaTag, useTitle } from '../utils/pwa';
import { createEffect, onMount, Show } from 'solid-js';
import LoadingPage from '../pages/LoadingPage.tsx';

const Page = (props: { children: any; themeColor?: string; title?: string; loading?: boolean }) => {
    // @ts-ignore
    const [getThemeColor, setThemeColor] = useMetaTag('theme-color');
    // @ts-ignore
    const [getTitle, setTitle] = useTitle();

    const handlePageLoaded = () => {
        if (!props.title) {
            setTitle('Sägewerk 2024');
        } else {
            setTitle(`${props.title} - Sägewerk 2024`);
        }

        if (!props.themeColor) {
            setThemeColor('#ffffff');
            document.body.style.backgroundColor = '#ffffff';
        } else {
            setThemeColor(props.themeColor);
            document.body.style.backgroundColor = props.themeColor;
        }
    };

    onMount(handlePageLoaded);

    createEffect(() => {
        if (!props.loading) {
            handlePageLoaded();
        }
    });

    return (
        <Show when={!props.loading} fallback={<LoadingPage />}>
            {props.children}
        </Show>
    );
};

export default Page;
