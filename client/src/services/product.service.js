import { helpHttp } from "../shared/helpers/helpHttp";
const url = import.meta.env.VITE_API_URL;

const api = helpHttp()

export const createProduct = async (data) => {
    return api.post(`${url}/productos`, { body: data })
}

export const getProducts = async () => {
    return api.get(`${url}/productos`)
}

export const updateProduct = async (id, data) => {
    return api.patch(`${url}/productos/${id}`, {body: data})
}

export const deleteProduct = async (id) => {
    return api.del(`${url}/productos/${id}`)
}