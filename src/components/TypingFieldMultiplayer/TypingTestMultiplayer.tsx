import { ChevronRightIcon, RefreshIcon } from '@heroicons/react/solid'
import { updateDoc, doc, arrayUnion, connectFirestoreEmulator } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import useTypingField from '../../customHooks/useTypingField'
import { db } from '../../firebase'
import { request } from '../../lib/axios/axios'
import { calculateTypingSpeed, getTimeNow } from '../../utils/utils'
import { AuthContext } from '../AuthContext/AuthContextProvider'
import { ITFActions, ITFProps, ITPActions } from '../TypingField/Interfaces'
import WordsContainer from '../TypingField/Views/WordsContainer'
import TypingTest from '../TypingFieldSinglePlayer/Views/TypingTest'
import UnFocusCover from '../TypingFieldSinglePlayer/Views/UnFocusCover'


type testMultType = {
    playerIndex: number,
    players: any[],
    words: string[][],
    roomId: string,
    winner: number[],
    leaveRoom?: () => void
}



const resultApi = (data: any) => {
    return request({ url: '/api/user_scores/', method: 'post', data })
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
function TypingTestMultiplayer({ ...props }: testMultType) {
    const { data, mutate: post_result } = Post_Result()

    const { AuthState: {
        isLoggedIn,
        userData
    } } = useContext(AuthContext)
    const opponentId = props.playerIndex === 1 ? 0 : 1
    // console.log(props.words)
    const { input,
        states,
        setter,
        refs,
        restart,
        focusInput
    } = useTypingField(props.words, () => { }, false)




    useEffect(() => {
        let isFinish = states.TFstate.HLIndex >= props.words.length
        console.log(isFinish)
        let [net, accuracy] = calculateTypingSpeed(states.TPstate.charCount, states.TPstate.charWrong, (getTimeNow() - states.timeStart))
        console.log(props.players[props.playerIndex].wordIndex, states.TFstate.HLIndex, props.words.length)

        let newPlayersStatus = props.players
        newPlayersStatus[props.playerIndex].wordIndex = states.TFstate.HLIndex
        newPlayersStatus[props.playerIndex] = {
            ...newPlayersStatus[props.playerIndex],
            wordIndex: states.TFstate.HLIndex,
            finish: props.players[props.playerIndex].wordIndex >= props.words.length,
            speed: net
        }

        if (isFinish) {
            setter.TPDispatch({ type: ITPActions.FINISH, payload: { net, accuracy } })
            setter.TFDispatch({ type: ITFActions.STOP })
            uploadToMainDatabase()
        }
        let data = {
            "players": newPlayersStatus,
            "winner": isFinish ? arrayUnion(props.playerIndex) : props.winner,

        }
        async function updateData() {
            await updateDoc(doc(db, "rooms", props.roomId), data)
        }

        updateData()

    }, [states.TFstate.HLIndex])


    const uploadToMainDatabase = () => {
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
        let update_data = {
            "word_scored": words_score
        }
        if (isLoggedIn) {
            console.log("uploading")
            post_result(update_data)
        }
        else console.log("not logged in")

    }



    const testViewProp = {
        words: props.words,
        finish: props.players[props.playerIndex]?.finish,
        position: props.winner[0] === props.playerIndex ? 1 : 2,
        input: { ...input },
        states: { ...states },
        refs: { ...refs },
        speed: props.players[props.playerIndex].speed,
        focusInput,
        leaveRoom: props.leaveRoom
    }


    const testViewOpponetProp = {
        words: props.words,
        finish: props.players[opponentId]?.finish,
        position: props.winner[0] === (opponentId) ? 1 : 2,
        wordIndex: props.players[opponentId].wordIndex,
        speed: props.players[opponentId].speed
    }

    return (
        <div className='h-scren w-screen center flex-row gap gap-x-40 text-gray-500 dark:text-white'>
            <div className='text-center '>
                <h1 className="text-xl tracking-wide   ">YOU</h1>
                <p className="text-lg tracking-wide ">{Math.round((props.players[props.playerIndex].wordIndex / props.words.length) * 100)} %</p>
                <TypingTestView {...testViewProp} />
            </div>
            <div className='text-center'>
                <h1 className="text-xl tracking-wide">{props.players[opponentId].username}</h1>
                <p className="text-lg tracking-wide">{(props.players[opponentId].wordIndex / props.words.length) * 100} %</p>
                <TypingTestViewOpponent {...testViewOpponetProp}
                />
            </div>
        </div>
    )

}



interface typingTestView extends ITFProps {
    finish: boolean,
    position: number,
    speed: number,
    leaveRoom?: () => void
}

const TypingTestView = ({ ...props }: typingTestView) => {
    return (
        <div className='relative z-0'>
            <div className={` p-2 rounded-2xl shadow-2xl`}>
                <div className=" font-semibold tracking-[.1em] text-xl border-b border-white text-blue-500 flex justify-between px-5 mb-5">
                </div>
                <div className='relative h-[350px] w-[400px]'>
                    <UnFocusCover open={(!props.states.TFstate.inputIsFocus && !props.finish) ? true : false} focusInput={props.focusInput} />
                    {(props.finish) &&


                        <div className="absolute h-full w-full center flex-col z-10 flex gap-5 backdrop-blur-lg">
                            <h1 className={` text-2xl absolute left-5 top-5 font-bold ${props.position === 1 ? "text-blue-500" : "text-blue-200"} `}>
                                {props.position}<sup className=''>{props.position === 1 ? "st" : "nd"}</sup>
                            </h1>
                            <h1 className="text-6xl text-blue-500 font-bold">{props.speed} KPM</h1>
                            <button className="absolute bottom-5 px-5 py-2.5 rounded-lg text-blue-300 font-bold text-xl duration-300 transition hover:shadow-blue-500 hover:shadow-md" onClick={props.leaveRoom}>LEAVE</button>
                        </div>}

                    <div className={`${(!props.states.TFstate.inputIsFocus && props.states.TFstate.timer !== 0) && 'blur-md'} h-full w-full overflow-hidden ${props.states.TFstate.timer === 0 && 'blur-md'} `}>
                        <div className='flex flex-col  tracking-[.5em] text-gray-200  transition-all ' style={{ transform: `translateY(${props.states.TFstate.wordPos}px` }}>
                            {
                                props.words.map((w: string[], i: number) => {
                                    return <WordsContainer
                                        word={w[1]}
                                        isIndex={i === props.states.TFstate.HLIndex}
                                        letterref={props.refs.letterRef}
                                        exessElContainer={props.refs.exessElContainer}
                                        index={i}
                                    />
                                })
                            }
                        </div>
                    </div>


                </div>

                <input className='block h-0' type="text" ref={props.refs.inputRef} onChange={props.input.inputHandler}
                    onFocus={props.input.onFocus} onBlur={props.input.onBlur}
                />
            </div>

        </div >
    )
}


type typingOpponent = {
    words: string[][],
    wordIndex: number,
    finish: boolean,
    position: number,
    speed: number
}
const TypingTestViewOpponent = ({ ...props }: typingOpponent) => {
    return (
        <div className='relative z-0'>
            <div className={` p-2 rounded-2xl shadow-2xl`}>
                <div className=" font-semibold tracking-[.1em] text-xl border-b border-white tesxt-white flex justify-between px-5 mb-5">

                </div>
                <div className='relative h-[350px] w-[400px]'>
                    {(props.finish) &&



                        <div className="absolute h-full w-full center z-10 flex gap-5 backdrop-blur-lg">
                            <h1 className={`text-2xl absolute left-5 top-5  font-bold ${props.position === 1 ? "text-blue-500" : "text-blue-200"} `}>
                                {props.position}<sup className=''>{props.position === 1 ? "st" : "nd"}</sup>
                            </h1>

                            <h1 className="text-6xl font-bold text-blue-500">{props.speed} KPM</h1>
                        </div>}
                    <div className="h-full w-full overflow-hidden ">
                        <div className='flex flex-col  tracking-[.5em] text-gray-200  transition-all ' style={{ transform: `translateY(${150 - props.wordIndex * 50}px` }}>
                            {

                                props.words.map((w: string[], i: number) => {
                                    return <div key={i} className={`transition-all text-center  h-[50px] center  word-${i === props.wordIndex ? 'highlight-light' : 'normal-light'}  dark:word-${i === props.wordIndex ? 'highlight' : 'normal'} font-semibold`}>
                                        <div className="">
                                            {w[1]}
                                        </div>
                                    </div>
                                })

                            }
                        </div>
                    </div>


                </div>

            </div>

        </div >

    )
}
export default TypingTestMultiplayer