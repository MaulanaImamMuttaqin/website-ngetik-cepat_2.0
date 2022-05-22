import React, { ChangeEvent, createContext, useEffect, useReducer, useState } from 'react'
import useKeyPress from '../../customHooks/useKeyPress'
import { ITFActions, ITPActions } from './Interfaces'
import Reducers from './reducers/Reducers'
import Refs from './refs'
import typingFieldStates from './states/typingFieldStates'


const TypingField = ({ children, query }: { children: any, query?: any }) => {
    const { data: words, isLoading, isFetching, refetch } = query
    const { TFstate, TPstate, TFDispatch, TPDispatch } = Reducers()
    const { letterRef, inputRef, exessElContainer, focusCoverRef } = Refs()
    const spacePressed = useKeyPress(" ", "key", window)
    const mousePressed = useKeyPress("mouse", "mouse", window)
    const [typedCorrect, setTypedCorrect] = useState<boolean | null>(null)
    const [lps, setLps] = useState<number>(0)
    const [lpsDisplay, setLpsDisplay] = useState<Array<number>>([])
    const [wordStuckList, setWordStuckList] = useState<Array<string>>([])

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        TFDispatch({ type: ITFActions.START })
        let element = letterRef.current[TFstate.HLIndex]
        let letters = element.childNodes as NodeListOf<HTMLElement>
        let word = e.target.value.trim()
        let word_arr = word.split("")
        TFDispatch({ type: ITFActions.TYPED, payload: word })
        if (word.length > TFstate.wordTyped.length) {
            TPDispatch({ type: ITPActions.CHAR })
        }

        words[TFstate.HLIndex].split("").forEach((l: any, i: number) => {
            if (word_arr[i] === undefined) {
                letters[i].style.color = "white"
            } else {
                if (letters[i].innerText === word_arr[i]) {
                    // console.log("right")
                    setTypedCorrect(true)
                    letters[i].style.color = '#3b82f6'
                } else {
                    letters[i].style.color = '#eb4034'
                    setTypedCorrect(false)
                    // console.log("wrong")
                }
            }
        })


        if (word_arr.length >= words[TFstate.HLIndex].length) {
            let exessCont = exessElContainer.current[TFstate.HLIndex]
            exessCont.innerHTML = ""

            word_arr.slice(words[TFstate.HLIndex].length, word_arr.length).forEach((w, i) => {
                let newEl = document.createElement("SPAN")
                let text = document.createTextNode(w)
                newEl.setAttribute("style", "color: rgb(235, 64, 52);")
                newEl.appendChild(text)
                exessCont.appendChild(newEl)
            })

        } else {
            exessElContainer.current[TFstate.HLIndex].innerHTML = ""
        }


    }

    const checkTypedWord = (typed: string, answer: string) => {
        let correct: boolean
        let typedArr = typed.split("")
        let answerArr = answer.split("")
        let wrongChar = (typedArr.length > answerArr.length) ? typedArr.length - answerArr.length : 0;
        // let looped = (typedArr.length > answerArr.length) ? typedArr : answerArr
        answerArr.forEach((a, i) => {
            if ((typedArr[i] === undefined) || (a !== typedArr[i])) {
                wrongChar++
            }
        })

        if (typed.trim() !== answer) {
            letterRef.current[TFstate.HLIndex].style.borderBottom = "2px solid #ad070f"
            setWordStuckList(prev => [...prev, words[TFstate.HLIndex]])
            TPDispatch({ type: ITPActions.INCORRECT, payload: wrongChar })
            return;
        }


        letterRef.current[TFstate.HLIndex].style.borderBottom = "none"
        TPDispatch({ type: ITPActions.CORRECT, payload: wrongChar })
    }
    const calculateTypingSpeed = (char: number, wrong: number) => {
        let gross = char / 5
        let time = typingFieldStates.timer / 60
        let net = Math.round((gross - wrong) / time)
        let accuracy = (((char - wrong) / char) * 100).toFixed(1)
        TPDispatch({ type: ITPActions.CALCULATE, payload: { net, accuracy } })
        // console.log(TPstate)
    }

    // const calculate


    useEffect(() => {
        let timerInterval: number = 0

        if (TFstate.typingStarted && TFstate.timer !== 0) {

            timerInterval = window.setInterval(() => {


                if (!TFstate.isPaused) {
                    TFDispatch({ type: ITFActions.DECREASE_TIME })
                }
            }, 1000)
        } else if (TFstate.timer === 0) {
            TPDispatch({ type: ITPActions.UPLOAD })
            TPDispatch({ type: ITPActions.SHOW })
            TFDispatch({ type: ITFActions.STOP })
            setWordStuckList([])
            calculateTypingSpeed(TPstate.charCount, TPstate.charWrong)
            clearInterval(timerInterval)

        }
        if (lpsDisplay[lpsDisplay.length - 1] < lpsDisplay[lpsDisplay.length - 2]) {
            setWordStuckList(prev => [...prev, words[TFstate.HLIndex]])
            console.log(wordStuckList)
        }

        return () => clearInterval(timerInterval)
    }, [TFstate.typingStarted, TFstate.timer, TFstate.isPaused])

    useEffect(() => {
        if (!(spacePressed && TFstate.timer !== 0 && TFstate.inputIsFocus)) return;
        TFDispatch({ type: ITFActions.SPACED })
        TPDispatch({ type: ITPActions.CHAR })
        checkTypedWord(TFstate.wordTyped, words[TFstate.HLIndex])
        inputRef.current!.value = ""
    }, [spacePressed])

    useEffect(() => {
        if (!(mousePressed && !TFstate.inputIsFocus)) return;
        inputRef.current!.focus()
    }, [mousePressed])

    useEffect(() => {
        if (!(TFstate.typingStarted && TFstate.timer === 0)) return;
        inputRef.current!.blur()
    }, [TFstate.typingStarted])

    useEffect(() => {
        inputRef.current!.focus()

    }, [])

    useEffect(() => {
        if (typedCorrect) setLps(lps => lps + 1)
    }, [TPstate.charCount])

    useEffect(() => {
        setLpsDisplay(prev => [...prev, lps])
        // setLpsDisplay((prev) => {
        //     prev.shift()
        //     prev.push(lps)
        //     console.log(prev)
        //     return prev
        // })

        setLps(0)
    }, [TFstate.timer])

    const restart = (new_test?: boolean) => {
        if (new_test) refetch()
        setWordStuckList([])
        restart_letter_styles(TFstate.HLIndex)
        inputRef.current!.value = ""
        inputRef.current!.focus()
        TFDispatch({ type: ITFActions.RESET })
        TPDispatch({ type: ITPActions.RESET })
        setLps(0)
    }

    const restart_letter_styles = (index: number) => {
        for (let a = 0; a <= index; a++) {
            let letter = letterRef.current[a].childNodes as NodeListOf<HTMLElement>
            letter.forEach((l, i) => {
                l.style.color = "white"
            })
        }

    }

    const focusInput = (): void => {
        inputRef.current!.focus()
    }

    const props = {
        words,
        isLoading,
        isFetching,
        input: {
            inputRef,
            inputHandler,
            onFocus: () => {
                TFDispatch({ type: ITFActions.FOCUS })
            },
            onBlur: () => TFDispatch({ type: ITFActions.UNFOCUS })
        },
        states: {
            TFstate, TPstate, lpsDisplay, wordStuckList
        },
        refs: {
            letterRef, inputRef, exessElContainer, focusCoverRef,
        },
        restart,
        focusInput
    }

    return <div className="h-screen center">
        {children(props)}\
    </div>

}

export default TypingField
