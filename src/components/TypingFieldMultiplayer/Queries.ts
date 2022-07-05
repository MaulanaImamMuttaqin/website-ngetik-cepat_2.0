import { useQuery } from "react-query"
import { request } from "../../lib/axios/axios"

const fetch_words_limit = (length: number) => {
    return request({ url: `/api/fetch_words/hard/${length}` })
}


export const Fetch_Words_Limit = (length: number) => {
    return useQuery(
        'words',
        () => fetch_words_limit(length),
        {
            refetchOnWindowFocus: false,
            select: data => data.data.words
        }
    )
}