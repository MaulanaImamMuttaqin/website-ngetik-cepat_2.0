import { request } from "../../lib/axios/axios"

export const fetch_words = () => {
    return request({ url: '/api/fetch_words/easy/300' })
}
