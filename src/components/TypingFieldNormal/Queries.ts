import { useMutation, useQuery } from "react-query"
import { fetch_words } from "./Api"

export const Fetch_Words = () => {
    return useQuery('words', fetch_words, {
        refetchOnWindowFocus: false,
        select: data => data.data.words
    })
}

