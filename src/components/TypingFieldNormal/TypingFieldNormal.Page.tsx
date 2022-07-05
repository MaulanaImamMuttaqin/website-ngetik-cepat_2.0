import { connectFirestoreEmulator } from 'firebase/firestore'
import { useContext, useEffect } from 'react'
import { useMutation } from 'react-query'
import useTypingField from '../../customHooks/useTypingField'
import { request } from '../../lib/axios/axios'
import { AuthContext } from '../AuthContext/AuthContextProvider'
import { Fetch_Words } from './Queries'
import TestResults from './Views/TestResults'
import TypingTest from './Views/TypingTest'


const result_api = (data: any) => {
    return request({ url: '/api/test_result/', method: 'post', data })
}

const Upload_Result = () => {
    return useMutation(result_api, {
        onSuccess: data => {
            console.log(data.data)
            console.log("success")
        }
    })
}

function TypingFieldSinglePlayer() {
    const { AuthState: {
        userData,
        isLoggedIn
    } } = useContext(AuthContext)
    const { data: words, isLoading, isFetching, refetch } = Fetch_Words()
    const { data, mutate: upload } = Upload_Result()
    const { input,
        states,
        refs,
        restart,
        setter,
        focusInput,
    } = useTypingField(words, refetch)




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
    useEffect(() => {
        console.log(words)
    }, [words])
    useEffect(() => {
        if (!states.TPstate.isFinish) return;
        if (!isLoggedIn) return;
        upload({
            user_id: userData.user_id,
            speed: states.TPstate.speed,
            test_type: 'normal'
        })
    }, [states.TPstate.isFinish])

    return (
        <div className="h-screen center">
            <h1 className='absolute top-20 text-3xl mb-10 font-bold dark:text-white'>Normal Mode</h1>
            <>

                <TypingTest {...props} />
                <TestResults {...props.states} />
            </>
        </div>
    )
}

export default TypingFieldSinglePlayer