/**
 * themeService.js
 * 
 * Este archivo explica cómo funciona un sistema de "Temas" (Modo Claro/Oscuro/Púrpura).
 * El secreto de un Tema es simplemente agregar una clase o un atributo a la etiqueta principal HTML (<html>).
 * Luego, el archivo CSS usa esa clase para cambiar los colores de toda la aplicación.
 */

// 1. Preguntamos si el navegador ya tenía guardado un tema de la última vez que el usuario entró.
// Si no hay nada guardado, usamos 'light' por defecto.
let temaActual = localStorage.getItem('theme') || 'light';

export const aplicarTema = (tema) => {
    // 2. Si el tema es claro, quitamos el atributo del DOM (usamos los colores por defecto del CSS)
    if (tema === 'light') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        // 3. Si es otro tema, le agregamos el atributo al tag <html>, por ejemplo: <html data-theme="dark">
        // El archivo CSS buscará este atributo y cambiará las variables de color.
        document.documentElement.setAttribute('data-theme', tema);
    }
};

export const establecerTema = (tema) => {
    // 4. Cambiamos el color visualmente
    aplicarTema(tema);

    // 5. Lo guardamos en localStorage para que no se pierda al recargar la página
    localStorage.setItem('theme', tema);
    temaActual = tema;
};

export const inicializarTema = () => {
    // 6. Apenas carga la página, aplicamos el tema que estaba guardado
    aplicarTema(temaActual);

    // 7. Buscamos el selector (<select>) en el HTML y hacemos que coincida con el tema actual
    const selectorTema = document.querySelector('#theme-selector');
    if (selectorTema) {
        selectorTema.value = temaActual;

        // 8. Escuchamos si el usuario elige un tema diferente en el desplegable
        selectorTema.addEventListener('change', (evento) => {
            establecerTema(evento.target.value);
        });
    }
};
