/**
 * i18nService.js
 * 
 * Este archivo explica cómo funciona la "Internacionalización" (i18n), es decir, cambiar el idioma.
 * ¿Cómo funciona? En lugar de escribir texto quemado en el HTML (ej: <h1>Hola</h1>),
 * le ponemos un atributo especial (ej: <h1 data-i18n="saludo"></h1>).
 * 
 * Luego, este archivo JS lee todos los elementos que tengan ese atributo, busca su significado
 * en los archivos JSON (diccionarios), y les inyecta el texto correcto.
 */

import i18next from 'i18next';
// Importamos los diccionarios (como si fueran libros de traducción)
import esTranslations from '../translations/es.json';
import enTranslations from '../translations/en.json';

export const updateDOMTranslations = () => {
    // 1. Buscamos todas las etiquetas HTML que tengan el atributo `data-i18n`
    document.querySelectorAll('[data-i18n]').forEach(element => {
        // 2. Extraemos su valor (por ejemplo: "app.title")
        const key = element.getAttribute('data-i18n');
        
        // 3. Le pedimos a i18next que busque la traducción y se la inyectamos como texto
        element.textContent = i18next.t(key);
    });

    // 4. Hacemos exactamente lo mismo pero para los placeholders de los <input>
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = i18next.t(key);
    });
};

export const changeLanguage = async (lang) => {
    // 5. Le decimos a la librería que cambie el idioma activo
    await i18next.changeLanguage(lang);
    
    // 6. Guardamos el idioma en localStorage para que sobreviva a la recarga
    localStorage.setItem('lang', lang);
    
    // 7. Re-dibujamos los textos en el HTML
    updateDOMTranslations();
    
    // 8. Avisamos a otros archivos que el idioma cambió (por si tienen que dibujar tablas de nuevo)
    window.dispatchEvent(new Event('languageChanged'));
};

export const initI18n = async () => {
    // 9. Cuando arranca la app, miramos si el usuario ya tenía un idioma guardado
    const savedLang = localStorage.getItem('lang') || 'es';

    // 10. Inicializamos la librería entregándole los diccionarios que importamos arriba
    await i18next.init({
        lng: savedLang,
        fallbackLng: 'es',
        resources: {
            es: { translation: esTranslations },
            en: { translation: enTranslations }
        }
    });

    // 11. Ejecutamos la traducción por primera vez
    updateDOMTranslations();
    
    // 12. Enlazamos el <select> del HTML para que active el cambio de idioma
    const langSelect = document.querySelector('#lang-selector');
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', async (event) => {
            await changeLanguage(event.target.value);
        });
    }
};
