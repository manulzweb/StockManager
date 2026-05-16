import { helpHttp } from "../shared/helpers/helpHttp";
const url = 'http://localhost:3099'

const api = helpHttp()

export const getProducts = async () => {
    return api.get(`${url}/productos`)
}