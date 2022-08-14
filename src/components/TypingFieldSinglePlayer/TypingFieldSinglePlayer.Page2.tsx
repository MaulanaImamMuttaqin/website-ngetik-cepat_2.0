import { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import useTypingField from '../../customHooks/useTypingField'
import { request } from '../../lib/axios/axios'
import { calculateTypingSpeed, getTimeNow } from '../../utils/utils'
import { AuthContext } from '../AuthContext/AuthContextProvider'
import { ITFActions, ITPActions } from '../TypingField/Interfaces'
import { Fetch_Words } from './Queries'
import TestResults from './Views/TestResults'
import TypingTest from './Views/TypingTest'


const resultApi = (data: any) => {
    return request({ url: '/api/user_scores/', method: 'post', data })
}

const fetchRecommendation = (id: number) => {
    // console.log(id)
    return request({ url: `/api/get_recommendation/${id}` })
}


const Post_Result = () => {
    return useMutation(resultApi,
        {
            onSuccess: data => {
                console.log(data)
            }
        }
    )
}

const Fetch_Recommendation = (id: number) => {
    // console.log(id)
    return useQuery('words', () => fetchRecommendation(id), {
        refetchOnWindowFocus: false,
        select: data => data.data.words
    })
}




function TypingFieldSinglePlayer() {
    const { AuthState: {
        isLoggedIn,
        userData
    } } = useContext(AuthContext)
    // let user_data = parseJWT(storage.getToken()?.access)
    // console.log(userData.user_id)
    const { data: words, isLoading, isFetching, refetch } = Fetch_Recommendation(userData.user_id ? userData.user_id : 0)
    // console.log(words)
    const { data, mutate: post_result } = Post_Result()
    const { input,
        states,
        refs,
        restart,
        setter,
        focusInput,
    } = useTypingField(words, refetch, false)



    useEffect(() => {
        console.log(words)
    }, [])


    useEffect(() => {

        let words_score: any = []


        states.SDList.forEach((w) => {
            let row = {
                "user_id": userData.user_id,
                "item_id": w.item_id,
                "word": w.word,
                "sd": w.standDeviation,
                "rating": w.calcStanDev,
                "timestamp": Math.floor(Date.now() / 1000)
            }
            words_score.push(row)
        })
        if (isFetching) return;
        // console.log(states.TFstate.HLIndex, words.length)    
        if (states.TFstate.HLIndex == words.length) {
            let [net, accuracy] = calculateTypingSpeed(states.TPstate.charCount, states.TPstate.charWrong, (getTimeNow() - states.timeStart))
            setter.TPDispatch({ type: ITPActions.FINISH, payload: { net, accuracy } })
            setter.TFDispatch({ type: ITFActions.STOP })
            let update_data = {
                "user_id": userData.user_id,
                "speed": net,
                "word_scored": words_score
            }
            console.log(update_data)
            if (isLoggedIn) post_result(update_data)
            else console.log("not logged in")
            // console.log(words_score)
        }
    }, [states.TFstate.HLIndex, words, isFetching])



    const props = {
        words,
        isLoading,
        isFetching,
        input: { ...input },
        states: { ...states },
        refs: { ...refs },
        restart,
        focusInput
    }

    if (!isLoggedIn) return (
        <div className="center h-screen dark:text-white flex-col">
            <div>You're not Logged In</div>
            <div>Please Logged in to use this features</div>
        </div>)


    return (
        <div className="h-screen center">
            <h1 className='absolute top-20 text-3xl mb-10 font-bold dark:text-white'>Practice Mode</h1>
            <>

                <TypingTest {...props} />
                <TestResults {...props.states} />
            </>
        </div>
    )
}

export default TypingFieldSinglePlayer