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
// debemos verificar `response.ok`.

export const obtenerProductosConFetch = async () => {
    try {
        const url = 'http://localhost:3000/productos';
        const response = await fetch(url);
        
        // Verificamos que la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }

        // Convertimos la respuesta a JSON
        const data = await response.json();
        return data;

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
// `response.ok` y `.json()` en cada petición en nuestro proyecto.

/*
// En el helper tendríamos algo así:
const helpHttp = () => {
    const customFetch = async (url, options) => {
        // ... configuración de headers ...
        const response = await fetch(url, options);
        return await response.json();
    }
    return {
        get: (url) => customFetch(url),
        post: (url, options) => customFetch(url, { method: 'POST', body: options.body }),
        // ...
    }
}
*/

import { helpHttp } from "../shared/utils/httpClient"; // Solo como demostración

export const obtenerProductosConHelper = async () => {
    try {
        const api = helpHttp();
        const url = 'http://localhost:3000/productos';
        
        // Mucho más limpio. El helper ya hace el `response.json()` internamente
        const data = await api.get(url);
        return data;

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
        const url = 'http://localhost:3000/productos';
        
        // axios.get hace la petición y el .data ya contiene el JSON parseado.
        // Además, si el status es 4xx o 5xx, axios lanza un error automáticamente
        // por lo que caerá directo en el bloque `catch`.
        const response = await axios.get(url);
        
        return response.data; // Aquí están nuestros productos
        
    } catch (error) {
        // Axios maneja los errores HTTP muy bien
        console.error("Error de Axios:", error.message);
    }
};
