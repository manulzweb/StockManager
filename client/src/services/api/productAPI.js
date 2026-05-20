import axios from 'axios';

const urlAPI = import.meta.env.VITE_API_URL + '/productos';

export const obtenerProductosAPI = async () => {
    const respuesta = await axios.get(urlAPI);
    return respuesta.data;
};

export const crearProductoAPI = async (nuevoProducto) => {
    const respuesta = await axios.post(urlAPI, nuevoProducto);
    return respuesta.data;
};

export const actualizarProductoAPI = async (id, datosActualizados) => {
    const respuesta = await axios.patch(`${urlAPI}/${id}`, datosActualizados);
    return respuesta.data;
};

export const eliminarProductoAPI = async (id) => {
    const respuesta = await axios.delete(`${urlAPI}/${id}`);
    return respuesta.data;
};
