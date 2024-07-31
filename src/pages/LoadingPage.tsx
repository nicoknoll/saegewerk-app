import { createSignal } from 'solid-js';
import { useTranslation } from '../utils/useTranslation.tsx';
import BladeIcon from '../../public/blade.svg';
import Page from '../components/Page.tsx';

const LoadingPage = () => {
    const { t } = useTranslation('loadingPage');
    const loadingTexts = [
        t('text0'),
        t('text1'),
        t('text2'),
        t('text3'),
        t('text4'),
        t('text5'),
        t('text6'),
        t('text7'),
        t('text8'),
        t('text9'),
        t('text10'),
        t('text11'),
        t('text12'),
        t('text13'),
        t('text14'),
    ];

    loadingTexts.sort(() => 0.5 - Math.random());

    const [loadingTextIndex, setLoadingTextIndex] = createSignal(0);

    setInterval(() => {
        setLoadingTextIndex((loadingTextIndex() + 1) % loadingTexts.length);
    }, 2000);

    return (
        <Page themeColor="#FFF700">
            <div class="w-full h-[100dvh] flex flex-col gap-6 items-center justify-center bg-brand-yellow">
                <div class="text-xl text-black text-center w-10 animate-spin-slow">
                    <BladeIcon />
                </div>
                <div class="text-black text-center font-item">{loadingTexts[loadingTextIndex()]}...</div>
            </div>
        </Page>
    );
};

export default LoadingPage;
