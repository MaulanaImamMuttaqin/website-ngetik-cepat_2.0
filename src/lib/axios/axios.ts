import axios from "axios";
import { storage } from "../../utils/storage";

const client = axios.create({ baseURL: 'http://localhost:8000' })

type options = {
    url: string,
    method?: string,
    data?: any
}

export const request = ({ ...options }: options) => {
    let token = storage.getToken()
    client.defaults.headers.common.Authorization = `Bearer ${token}`
    const onSuccess = (response: any) => response
    const onError = (error: any) => {
        // optinaly catch errors and add additional logging here
        return error
    }

    return client(options).then(onSuccess).catch(onError)
}