/**
 * apiExamples.js
 * 
 * Este archivo no se usa en la aplicación en producción. Está diseñado
 * para mostrar a estudiantes cómo ha evolucionado la forma de consumir APIs.
 * 
 * Imagina que queremos obtener la lista de productos de `http://localhost:3000/productos`.
 */

// =========================================================================
// NIVEL 1: FETCH NATIVO (Básico pero repetitivo)
// =========================================================================
// `fetch` es nativo de JavaScript, no requiere instalaciones extra.
// Sin embargo, tenemos que convertir la respuesta a JSON manualmente,
// y si hay un error HTTP (ej: 404), fetch NO lanza error automáticamente, 
// debemos verificar `respuesta.ok`.

export const obtenerProductosConFetch = async () => {
    try {
        const URL_API = 'http://localhost:3000/productos';
        const respuesta = await fetch(URL_API);

        // Verificamos que la respuesta fue exitosa
        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

        // Convertimos la respuesta a JSON
        const datos = await respuesta.json();
        return datos;

    } catch (error) {
        console.error("Error obteniendo productos:", error);
    }
};


// =========================================================================
// NIVEL 2: FETCH + HELPER (Abstracción)
// =========================================================================
// En el código original de este proyecto existía un `helpHttp.js`.
// Ese archivo contenía una función que "envolvía" (encapsulaba) a `fetch`.
// Su propósito era simplificar el código para no tener que escribir 
// `respuesta.ok` y `.json()` en cada petición en nuestro proyecto.

/*
// En el helper tendríamos algo así:
const helpHttp = () => {
    const customFetch = async (url, opciones) => {
        // ... configuración de headers ...
        const respuesta = await fetch(url, opciones);
        return await respuesta.json();
    }
    return {
        get: (url) => customFetch(url),
        post: (url, opciones) => customFetch(url, { method: 'POST', body: opciones.body }),
        // ...
    }
}
*/

import { helpHttp } from "../shared/utils/httpClient"; // Solo como demostración

export const obtenerProductosConHelper = async () => {
    try {
        const api = helpHttp();
        const URL_API = 'http://localhost:3000/productos';

        // Mucho más limpio. El helper ya hace el `respuesta.json()` internamente
        const datos = await api.get(URL_API);
        return datos;

    } catch (error) {
        console.error("Error con el helper:", error);
    }
};


// =========================================================================
// NIVEL 3: AXIOS (El estándar de la industria)
// =========================================================================
// axios es una librería de terceros (se instala con `npm install axios`).
// Hace exactamente lo mismo que el Helper que construimos en el Nivel 2,
// pero de forma más robusta, con más utilidades y es usado por millones 
// de empresas.

import axios from 'axios';

export const obtenerProductosConAxios = async () => {
    try {
        const URL_API = 'http://localhost:3000/productos';

        // axios.get hace la petición y el .data ya contiene el JSON parseado.
        // Además, si el status es 4xx o 5xx, axios lanza un error automáticamente
        // por lo que caerá directo en el bloque `catch`.
        const respuesta = await axios.get(URL_API);

        return respuesta.data; // Aquí están nuestros productos

    } catch (error) {
        // Axios maneja los errores HTTP muy bien
        console.error("Error de Axios:", error.message);
    }
};
