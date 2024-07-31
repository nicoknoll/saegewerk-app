const getIsStandalone = () => {
    if (document.referrer.startsWith('android-app://')) return true;
    if ((window as any)?.navigator?.standalone) return true;
    if ((window as any)?.clientInformation?.standalone) return true;
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
    return false;
};

export const isAndroid = !!navigator.userAgent.match(/Android/i);
export const isBlackBerry = !!navigator.userAgent.match(/BlackBerry/i);
export const isIOS = !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
export const isFirefox = !!navigator.userAgent.match(/FxiOS|Firefox/i);
export const isChrome = !!navigator.userAgent.match(/CriOS|Chrome/i);
export const isSafari = !!navigator.userAgent.match(/Safari/i);
export const isOpera = !!navigator.userAgent.match(/Opera Mini/i);

export const isWindows = !!(navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i));
export const isSamsung = !!navigator.userAgent.match(
    /SAMSUNG|Samsung|SGH-[I|N|T]|GT-[I|N]|SM-[A|N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L/i
);
export const isMobile = isAndroid || isBlackBerry || isIOS || isOpera || isWindows || isSamsung;
export const isStandalone = getIsStandalone();
export const isInstalled = isStandalone || (isIOS && !isSafari);
export const canInstall = isMobile; // && !isInstalled && (!isIOS || isSafari);

export const useMetaTag = (name: string) => {
    const getValue = () => {
        const metaTag = document.querySelector(`meta[name="${name}"]`);
        return metaTag?.getAttribute('content') || '';
    };

    const setValue = (value: string) => {
        const metaTag = document.querySelector(`meta[name="${name}"]`);
        if (metaTag) {
            metaTag.setAttribute('content', value);
        } else {
            const newMetaTag = document.createElement('meta');
            newMetaTag.name = name;
            newMetaTag.content = value;
            document.head.appendChild(newMetaTag);
        }
    };

    return [getValue, setValue];
};

export const useTitle = () => {
    const getValue = () => {
        const titleTag = document.querySelector('title');
        return titleTag?.innerHTML || document.title || '';
    };

    const setValue = (value: string) => {
        const titleTag = document.querySelector('title');
        if (titleTag) {
            titleTag.innerHTML = value;
        } else {
            const newTitleTag = document.createElement('title');
            newTitleTag.innerHTML = value;
            document.head.appendChild(newTitleTag);
        }
        document.title = value;
    };

    return [getValue, setValue];
};
