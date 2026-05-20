import i18next from 'i18next';
import esTranslations from '../translations/es.json';
import enTranslations from '../translations/en.json';

export const initI18n = async () => {
    const savedLang = localStorage.getItem('lang') || 'es';

    await i18next.init({
        lng: savedLang,
        fallbackLng: 'es',
        resources: {
            es: { translation: esTranslations },
            en: { translation: enTranslations }
        }
    });

    updateDOMTranslations();
    
    const langSelect = document.querySelector('#lang-selector');
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', async (e) => {
            await changeLanguage(e.target.value);
        });
    }
};

export const changeLanguage = async (lang) => {
    await i18next.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    updateDOMTranslations();
    // Dispatch an event so components can re-render if needed
    window.dispatchEvent(new Event('languageChanged'));
};

export const updateDOMTranslations = () => {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = i18next.t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = i18next.t(key);
    });
};
