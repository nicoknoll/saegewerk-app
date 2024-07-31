import { Accessor, createContext, splitProps, useContext } from 'solid-js';
import createLocalStorageSignal from './createLocalStorageSignal.tsx';

export const LANGUAGE_STORAGE_KEY = 'language';

interface ITranslation {
    [key: string]: string | ITranslation;
}

interface ITranslationContext {
    translations: {
        [key: string]: ITranslation;
    };
    fallbackLanguage?: string;
    language: Accessor<string>;
    onLanguageChange: (language: string) => void;
}

interface IUseTranslation {
    t: (key: string, placeholders?: Record<string, string>) => string;
    language: Accessor<string>;
    onLanguageChange: (language: string) => void;
}

const TranslationContext = createContext<ITranslationContext>({
    translations: {},
    fallbackLanguage: undefined,
    language: () => '',
    onLanguageChange: () => undefined,
});

const get = (t: any, path: string) => path.split('.').reduce((r, k) => r?.[k], t);

export const TranslationProvider = (props: {
    translations: {
        [key: string]: ITranslation;
    };
    children: any;
    fallbackLanguage?: string;
}) => {
    const navigatorLanguage = navigator.language.split('-')[0];
    const [language, setLanguage] = createLocalStorageSignal(LANGUAGE_STORAGE_KEY, navigatorLanguage);
    const handleLanguageChange = (language: string) => {
        if (!Object.keys(props.translations).includes(language)) {
            throw new Error(`Language "${language}" not found in translations.`);
        }
        setLanguage(language);
    };

    const [local, others] = splitProps(props, ['translations', 'fallbackLanguage']);
    return (
        <TranslationContext.Provider
            value={{
                translations: local.translations,
                fallbackLanguage: local.fallbackLanguage,
                language,
                onLanguageChange: handleLanguageChange,
            }}
        >
            {others.children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = (prefix?: string): IUseTranslation => {
    const {
        translations: translationsByLanguage,
        fallbackLanguage,
        language,
        onLanguageChange,
    } = useContext(TranslationContext);

    const t = (key: string, placeholders: Record<string, string> = {}) => {
        const translations = translationsByLanguage[language()];
        const fallbackTranslations = fallbackLanguage ? translations[fallbackLanguage] : {};

        const fullKey = prefix ? `${prefix}.${key}` : key;

        let translation = get(translations, fullKey) || get(fallbackTranslations, fullKey) || fullKey;
        if (placeholders) {
            Object.entries(placeholders).forEach(([k, v]) => {
                translation = translation.replace(`{${k}}`, v);
            });
        }
        return translation;
    };

    return { t, language, onLanguageChange };
};
