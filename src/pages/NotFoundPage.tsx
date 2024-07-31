import Page from '../components/Page.tsx';
import { A } from '@solidjs/router';
import { HOME_PATH } from '../constants.ts';
import { useTranslation } from '../utils/useTranslation.tsx';

const NotFoundPage = () => {
    const { t } = useTranslation('notFoundPage');
    return (
        <Page title={t('title')} themeColor="#000000">
            <main class="w-full h-[100dvh] flex flex-col justify-center items-center">
                <div class="bg-black w-full flex-1 shrink-[4] basis-36 min-[672px]:invisible min-[672px]:min-h-36" />
                <div class="w-full h-auto max-w-2xl overflow-hidden min-[672px]:rounded-full flex items-center justify-center relative">
                    <img
                        src="/notfound.gif"
                        alt="Not Found"
                        class="min-[672px]:rounded-full min-[672px]:h-full flex-none"
                    />
                    <div class="absolute inset-0 bottom-auto min-[672px]:h-1/2 h-1/3 flex gap-4 flex-col items-center justify-center">
                        <h1 class="text-white text-2xl font-medium">{t('description')}</h1>
                        <A href={HOME_PATH} class="text-white underline">
                            {t('backToHome')}
                        </A>
                    </div>
                </div>
                <div class="bg-white w-full flex-1 basis-36 min-[672px]:invisible min-[672px]:min-h-36" />
            </main>
        </Page>
    );
};

export default NotFoundPage;
