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
    const mousePressed = useKeyPress("mouse", "mouse", window)
    const [typedCorrect, setTypedCorrect] = useState<boolean | null>(null)
    const [letterTyped, setLTyped] = useState<number>(0)
    // const [lpsDisplay, setLpsDisplay] = useState<Array<number>>([])
    const [wordStuckList, setWordStuckList] = useState<Array<any>>([])
    const [rythmInterval, setRythmInterval] = useState<NodeJS.Timer>(setInterval(() => null))
    const [intervalIsStarted, setIntervalIsStarted] = useState<boolean | null>(null)
    const [nextTypedDuration, setNextTypedDuration] = useState<number>(0)
    const [ryhtmWord, setRythmWord] = useState<Array<number>>([])
    // const [wordStuckDict, ,setWordStuckdict] = useState<

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        TFDispatch({ type: ITFActions.START })
        let spaceExist = e.target.value[e.target.value.length - 1] === " " ? true : false
        let element = letterRef.current[TFstate.HLIndex]
        let letters = element.childNodes as NodeListOf<HTMLElement>
        // let typed = e.target.value.split(/\s+/)
        let word = e.target.value.trim()
        let word_arr = word.split("")
        TFDispatch({ type: ITFActions.TYPED, payload: word })
        if (word.length > TFstate.wordTyped.length) {
            TPDispatch({ type: ITPActions.CHAR })
        }

        // loop for coloring each letter in the word
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

        // loop to render an excessed letter typed by the user and paint it with color red
        if (word_arr.length > words[TFstate.HLIndex].length) {
            let exessCont = exessElContainer.current[TFstate.HLIndex]
            exessCont.innerHTML = ""

            word_arr.slice(words[TFstate.HLIndex].length, word_arr.length).forEach((w, i) => {
                let newEl = document.createElement("SPAN")
                let text = document.createTextNode(w)
                newEl.setAttribute("style", "color: rgb(235, 64, 52);")
                newEl.appendChild(text)
                exessCont.appendChild(newEl)
            })
            setTypedCorrect(false)
        } else {
            exessElContainer.current[TFstate.HLIndex].innerHTML = ""
        }

        if (!intervalIsStarted && intervalIsStarted != null) {

            setRythmInterval(setInterval(() => {
                // console.log("input handler")
                setNextTypedDuration(p => p + 1)
            }, 10))
            setIntervalIsStarted(true)
        }
        // if the user pressed space
        if (spaceExist) {
            if (word === "") return inputRef.current!.value = ""
            TFDispatch({ type: ITFActions.SPACED })
            TPDispatch({ type: ITPActions.CHAR })
            checkTypedWord(TFstate.wordTyped, words[TFstate.HLIndex])
            inputRef.current!.value = ""
            clearInterval(rythmInterval)
            setIntervalIsStarted(false)
            setRythmWord(p => [...p, nextTypedDuration])
            setNextTypedDuration(0)
            console.log(ryhtmWord)
            setRythmWord([])
        }

    }

    const checkTypedWord = (typed: string, answer: string) => {
        let correct: boolean
        let typedArr = typed.split("")
        let answerArr = answer.split("")
        let wrongChar = (typedArr.length > answerArr.length) ? typedArr.length - answerArr.length : 0;
        answerArr.forEach((a, i) => {
            if ((typedArr[i] === undefined) || (a !== typedArr[i])) {
                wrongChar++
            }
        })

        if (typed.trim() !== answer) {
            letterRef.current[TFstate.HLIndex].style.borderBottom = "2px solid #ad070f"
            let data = [...wordStuckList]
            let obj = data.find((o, i) => {
                if (o.word === words[TFstate.HLIndex]) {
                    data[i].correct = false
                    data[i].totClicked = letterTyped
                    return true
                }
            })

            if (obj) setWordStuckList(data)
            else setWordStuckList([...data, {
                word: words[TFstate.HLIndex],
                totClicked: letterTyped,
                correct: false
            }])

            setTypedCorrect(null)

            TPDispatch({ type: ITPActions.INCORRECT, payload: wrongChar })
            return;
        } else {
            let data = [...wordStuckList]
            let obj = data.find((o, i) => {
                if (o.word === words[TFstate.HLIndex]) {
                    data[i].totClicked = letterTyped
                    return true
                }
            })
            if (obj) setWordStuckList(data)
        }

        setLTyped(0)
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

        // if (lpsDisplay[lpsDisplay.length - 1] < lpsDisplay[lpsDisplay.length - 2]) {
        //     setWordStuckList(prev => [...prev, words[TFstate.HLIndex]])
        //     console.log(wordStuckList)
        // }

        return () => clearInterval(timerInterval)
    }, [TFstate.typingStarted, TFstate.timer, TFstate.isPaused])


    useEffect(() => {
        if (!TFstate.typingStarted) return;
        const interval = setInterval(() => {
            setNextTypedDuration(p => p + 1)
        }, 1)
        setRythmInterval(interval)
        setIntervalIsStarted(true)
        return () => {
            clearInterval(interval)
        }
    }, [TFstate.typingStarted])


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
        setLTyped(p => p + 1)
        if (!typedCorrect && typedCorrect != null) {

            let data = [...wordStuckList]
            let obj = data.find((o, i) => {
                if (o.word === words[TFstate.HLIndex]) {
                    data[i] = {
                        ...data[i],
                        missClick: data[i].missClick + 1
                    }
                    return true
                }
            })

            if (obj) return setWordStuckList(data)
            else return setWordStuckList(prev => [...prev, {
                word: words[TFstate.HLIndex],
                correct: true,
                missClick: 1
            }])
        }
        else {
            setRythmWord(p => [...p, nextTypedDuration])
            setNextTypedDuration(0)
        }
    }, [TPstate.charCount])

    // useEffect(() => {
    //     setLpsDisplay(prev => [...prev, lps])
    //     setLps(0)
    // }, [TFstate.timer])

    const restart = (new_test?: boolean) => {
        if (new_test) refetch()
        setWordStuckList([])
        restart_letter_styles(TFstate.HLIndex)
        inputRef.current!.value = ""
        inputRef.current!.focus()
        TFDispatch({ type: ITFActions.RESET })
        TPDispatch({ type: ITPActions.RESET })
        setLTyped(0)
        setNextTypedDuration(0)
        setIntervalIsStarted(null)
        setRythmWord([])
        console.log(ryhtmWord)
        clearInterval(rythmInterval)
        // setLps(0)
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
            TFstate, TPstate,
            // lpsDisplay, 
            nextTypedDuration,
            wordStuckList
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
