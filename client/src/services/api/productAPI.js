import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL + '/productos';

export const obtenerProductosAPI = async () => {
    const respuesta = await axios.get(URL_API);
    return respuesta.data;
};

export const crearProductoAPI = async (nuevoProducto) => {
    const respuesta = await axios.post(URL_API, nuevoProducto);
    return respuesta.data;
};

export const actualizarProductoAPI = async (id, datosActualizados) => {
    const respuesta = await axios.patch(`${URL_API}/${id}`, datosActualizados);
    return respuesta.data;
};

export const eliminarProductoAPI = async (id) => {
    const respuesta = await axios.delete(`${URL_API}/${id}`);
    return respuesta.data;
};
