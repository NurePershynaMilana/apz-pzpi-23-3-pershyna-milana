import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import uk from './locales/uk.json';
import en from './locales/en.json';

const LANGUAGE_KEY = 'plantcare_language';

const RTL_LANGUAGES = ['ar', 'he', 'fa'];

const applyDocumentLang = (lng: string) => {
    document.documentElement.lang = lng;
    document.documentElement.dir = RTL_LANGUAGES.includes(lng) ? 'rtl' : 'ltr';
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            uk: { translation: uk },
            en: { translation: en },
        },
        fallbackLng: 'uk',
        defaultNS: 'translation',
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: LANGUAGE_KEY,
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
    });

i18n.on('languageChanged', applyDocumentLang);

if (i18n.language) {
    applyDocumentLang(i18n.language);
}

export default i18n;
