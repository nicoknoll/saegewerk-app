import { canInstall, isAndroid, isInstalled } from '../utils/pwa.tsx';
import Fa from 'solid-fa';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Text from '../components/Text.tsx';
import Page from '../components/Page.tsx';
import { useTranslation } from '../utils/useTranslation.tsx';
import { Navigate, useNavigate } from '@solidjs/router';
import { createSignal, onCleanup, onMount } from 'solid-js';

const ShareIcon = (props: { class?: string }) => (
    <svg width="17.334" height="23.4863" {...props} viewBox={'0 0 17.334 23.4863'}>
        <g>
            <rect height="23.4863" opacity="0" width="17.334" x="0" y="0" />
            <path
                d="M3.06641 22.041L14.2676 22.041C16.3086 22.041 17.334 21.0254 17.334 19.0137L17.334 9.26758C17.334 7.25586 16.3086 6.24023 14.2676 6.24023L11.543 6.24023L11.543 7.8125L14.2383 7.8125C15.2051 7.8125 15.7617 8.33984 15.7617 9.35547L15.7617 18.9258C15.7617 19.9414 15.2051 20.4688 14.2383 20.4688L3.08594 20.4688C2.10938 20.4688 1.57227 19.9414 1.57227 18.9258L1.57227 9.35547C1.57227 8.33984 2.10938 7.8125 3.08594 7.8125L5.79102 7.8125L5.79102 6.24023L3.06641 6.24023C1.02539 6.24023 0 7.25586 0 9.26758L0 19.0137C0 21.0254 1.02539 22.041 3.06641 22.041ZM8.66211 14.3945C9.08203 14.3945 9.44336 14.043 9.44336 13.6328L9.44336 3.60352L9.38477 2.13867L10.0391 2.83203L11.5234 4.41406C11.6602 4.57031 11.8555 4.64844 12.0508 4.64844C12.4512 4.64844 12.7637 4.35547 12.7637 3.95508C12.7637 3.75 12.6758 3.59375 12.5293 3.44727L9.22852 0.263672C9.0332 0.0683594 8.86719 0 8.66211 0C8.4668 0 8.30078 0.0683594 8.0957 0.263672L4.79492 3.44727C4.64844 3.59375 4.57031 3.75 4.57031 3.95508C4.57031 4.35547 4.86328 4.64844 5.27344 4.64844C5.45898 4.64844 5.67383 4.57031 5.81055 4.41406L7.28516 2.83203L7.94922 2.13867L7.89062 3.60352L7.89062 13.6328C7.89062 14.043 8.24219 14.3945 8.66211 14.3945Z"
                fill="currentColor"
                fill-opacity="0.85"
            />
        </g>
    </svg>
);

const InstallPage = () => {
    const { t } = useTranslation('installPage');
    const navigate = useNavigate();

    if (isInstalled || !canInstall) {
        return <Navigate href="/artists" />;
    }

    const [deferredPrompt, setDeferredPrompt] = createSignal<any>(null);

    const handleAppInstalled = () => {
        navigate('/artists');
    };

    const handleBeforeInstallPrompt = (event: any) => {
        event.preventDefault();
        setDeferredPrompt(event);
    };

    onMount(() => {
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
    });

    onCleanup(() => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
    });

    return (
        <Page themeColor="#000000">
            <div class="fixed inset-0 bottom-14 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white rounded-xl w-[460px] max-w-[84%] overflow-hidden">
                    <div class="h-24 relative overflow-hidden py-4 mt-4">
                        <div class="flex gap-2 absolute left-1/2 -translate-x-1/2">
                            <div class="w-16 h-16 rounded-xl bg-neutral-100 flex-none" />
                            <div class="w-16 h-16 rounded-xl bg-neutral-100 flex-none" />
                            <div class="w-16 h-16 rounded-xl bg-neutral-100 flex-none" />
                            <div class="w-16 h-16 rounded-xl bg-neutral-200 flex-none overflow-hidden shadow">
                                <img alt="Logo" src="/icon.png" class="object-cover" />
                            </div>
                            <div class="w-16 h-16 rounded-xl bg-neutral-100 flex-none" />
                            <div class="w-16 h-16 rounded-xl bg-neutral-100 flex-none" />
                            <div class="w-16 h-16 rounded-xl bg-neutral-100 flex-none" />
                        </div>
                    </div>

                    <div class="p-6 flex flex-col gap-4 mb-2">
                        <h2 class="text-xl font-semibold text-center">
                            <Text>{t('title')}</Text>
                        </h2>
                        <p class="text-center">
                            <Text>{t('description')}</Text>
                        </p>
                    </div>

                    <div class="text-center bg-neutral-200 py-3 px-4 leading-relaxed">
                        {isAndroid ? (
                            deferredPrompt() ? (
                                <button
                                    onClick={() => deferredPrompt().prompt()}
                                    class="rounded bg-brand-yellow hover:opacity-50 transition-all px-4 py-1"
                                >
                                    <Text>{t('android.installButton')}</Text>
                                </button>
                            ) : (
                                <>
                                    <Text>{t('android.instructions1')}</Text>{' '}
                                    <Fa icon={faEllipsisV} class="inline-block mx-1 w-4 h-auto" />{' '}
                                    <Text>{t('android.instructions2')}</Text>
                                    <Text>{t('android.instructions3')}</Text>
                                </>
                            )
                        ) : (
                            <>
                                <Text>{t('iOS.instructions1')}</Text>{' '}
                                <ShareIcon class="inline-block text-blue-500 mx-1 w-3 h-auto" />{' '}
                                <Text>{t('iOS.instructions2')}</Text>
                                <Text>{t('iOS.instructions3')}</Text>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default InstallPage;
