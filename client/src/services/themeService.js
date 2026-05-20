/**
 * themeService.js
 * 
 * Este archivo explica cómo funciona un sistema de "Temas" (Modo Claro/Oscuro/Púrpura).
 * El secreto de un Tema es simplemente agregar una clase o un atributo a la etiqueta principal HTML (<html>).
 * Luego, el archivo CSS usa esa clase para cambiar los colores de toda la aplicación.
 */

// 1. Preguntamos si el navegador ya tenía guardado un tema de la última vez que el usuario entró.
// Si no hay nada guardado, usamos 'light' por defecto.
let currentTheme = localStorage.getItem('theme') || 'light';

export const applyTheme = (theme) => {
    // 2. Si el tema es claro, quitamos el atributo del DOM (usamos los colores por defecto del CSS)
    if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        // 3. Si es otro tema, le agregamos el atributo al tag <html>, por ejemplo: <html data-theme="dark">
        // El archivo CSS buscará este atributo y cambiará las variables de color.
        document.documentElement.setAttribute('data-theme', theme);
    }
};

export const setTheme = (theme) => {
    // 4. Cambiamos el color visualmente
    applyTheme(theme);
    
    // 5. Lo guardamos en localStorage para que no se pierda al recargar la página
    localStorage.setItem('theme', theme);
    currentTheme = theme;
};

export const initTheme = () => {
    // 6. Apenas carga la página, aplicamos el tema que estaba guardado
    applyTheme(currentTheme);
    
    // 7. Buscamos el selector (<select>) en el HTML y hacemos que coincida con el tema actual
    const themeSelect = document.querySelector('#theme-selector');
    if (themeSelect) {
        themeSelect.value = currentTheme;
        
        // 8. Escuchamos si el usuario elige un tema diferente en el desplegable
        themeSelect.addEventListener('change', (event) => {
            setTheme(event.target.value);
        });
    }
};
