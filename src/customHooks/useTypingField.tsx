import React, { ChangeEvent, useEffect, useState } from 'react'
import useKeyPress from './useKeyPress'
import { calculateRyhtm, calculateTypingSpeed, getStandardDeviation, getTimeNow } from '../utils/utils'
import { ITFActions, ITPActions } from '../components/TypingField/Interfaces'
import Reducers from '../components/TypingField/reducers/Reducers'
import Refs from '../components/TypingField/refs'
import typingFieldStates from '../components/TypingField/states/typingFieldStates'

function useTypingField(words: Array<string[]>, reWords: () => void, enableTimer: boolean = true) {
    const { TFstate, TPstate, TFDispatch, TPDispatch } = Reducers()
    const { letterRef, inputRef, exessElContainer, focusCoverRef } = Refs()
    const mousePressed = useKeyPress("mouse", "mouse", window)

    const [ryhtmWord, setRythmWord] = useState<Array<number>>([])
    const [SDList, setSDList] = useState<Array<any>>([])

    const [wrgLettTotal, setWrgLettTotal] = useState<number>(0)
    const [ifWordStarted, setIfWordStarted] = useState<boolean>(false)
    const [wrgIncremented, setWrgIncremented] = useState<boolean>(false)
    let peakDetect = false

    const [timeStart, setTimeStart] = useState<number>(0)

    const [c, sc] = useState<boolean>(false)
    const [excessive_i, s_excessive_i] = useState<number | null>(null)

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        TFDispatch({ type: ITFActions.START })
        let spaceExist = e.target.value[e.target.value.length - 1] === " " ? true : false
        let element = letterRef.current[TFstate.HLIndex]
        let letters = element.childNodes as NodeListOf<HTMLElement>
        let word = e.target.value
        let word_arr = word.split("")
        let typedCorrect: boolean | null = words[TFstate.HLIndex][1].startsWith(word.trim())
        let excessive = false

        TFDispatch({ type: ITFActions.TYPED, payload: word })
        if (word.length > TFstate.wordTyped.length) {
            TPDispatch({ type: ITPActions.CHAR })
        }

        // loop for coloring each letter in the word
        words[TFstate.HLIndex][1].split("").forEach((l: any, i: number) => {
            letters[i].classList.remove("dark:text-white", "text-blue-500", "text-red-600", "border-b-2", "border-red-600", "text-gray-900")
            // console.log(letters[i].innerHTML)
            if (word_arr[i] === undefined) {
                letters[i].classList.add("dark:text-white", "text-gray-900")
            } else {
                if (letters[i].innerText === word_arr[i]) letters[i].classList.add("text-blue-500")
                else letters[i].classList.add("text-red-600", "border-b-2", "border-red-600")
            }
        })

        if (word_arr.length > words[TFstate.HLIndex][1].length) {
            let exessCont = exessElContainer.current[TFstate.HLIndex]
            exessCont.innerHTML = ""
            excessive = true
            word_arr.slice(words[TFstate.HLIndex][1].length, word_arr.length).forEach((w, i) => {
                let newEl = document.createElement("SPAN")
                let text = document.createTextNode(w)
                newEl.classList.add("text-red-600", "border-b-2", "border-red-600")
                newEl.appendChild(text)
                exessCont.appendChild(newEl)
            })
            sc(true)
        } else {
            exessElContainer.current[TFstate.HLIndex].innerHTML = ""
            excessive = false
            sc(false)
        }

        if (((typedCorrect && typedCorrect != null) || !ifWordStarted)) {
            setRythmWord(p => {
                let new_s = [...p, Math.round(Date.now() / 10)]
                return new_s
            })
            peakDetect = false
            setIfWordStarted(true)
            setWrgIncremented(false)

        } else {
            peakDetect = true
        }

        if (peakDetect && !wrgIncremented && !excessive) {
            setWrgLettTotal(p => p + 1)
            setWrgIncremented(true)
            // console.log("wrong")
        }



        // if the user pressed space move to next word and check the previously typed word if correct or not 
        if (spaceExist) {
            let [isCorrect, wrongChar] = checkTypedWord(TFstate.wordTyped, words[TFstate.HLIndex][1])

            if (!typedCorrect || !isCorrect) return;
            if (word === "") return inputRef.current!.value = ""

            TFDispatch({ type: ITFActions.SPACED })
            if (isCorrect) TPDispatch({ type: ITPActions.CORRECT, payload: wrongChar })
            else TPDispatch({ type: ITPActions.INCORRECT, payload: wrongChar })

            let rythm = calculateRyhtm(ryhtmWord)
            if (excessive_i) {
                console.log(rythm, excessive_i)
                console.log(removeExcessive(rythm, [excessive_i - 1]))
                // console.log(removeItem(rythm, [excessive_i]))
                // rythm = console.log(rythm, excessive_i)
            }
            setSDList(p => [...p, {
                word: words[TFstate.HLIndex][1],
                item_id: words[TFstate.HLIndex][0],
                totalPeak: wrgLettTotal,
                standDeviation: getStandardDeviation(rythm),
                calcStanDev: calculateWordScore(getStandardDeviation(rythm)),
                // calStandDeviation: getStandardDeviation(rythm) * (wrgLettTotal < 1 ? 1 : wrgLettTotal),
                rythm: rythm,
                correct: isCorrect
            }])
            inputRef.current!.value = ""
            s_excessive_i(null)
            setRythmWord([])
            // wrgLettTotal = 0
            setWrgLettTotal(0)
            // ifWordStarted = false
            setIfWordStarted(false)
        }
    }


    const removeExcessive = (ryhtmWord: number[], index: number[]) => {
        let localrythm = ryhtmWord

        index.forEach(el => {
            localrythm.splice(el, 1);
        });

        return localrythm
    }

    const calculateWordScore = (sd: number): number => {
        let calculate = ((sd / 70) * 4) + 1
        return calculate > 5 ? 5 : calculate
    }



    const checkTypedWord = (typed: string, answer: string) => {
        let typedArr = typed.split("")
        let answerArr = answer.split("")
        let wrongChar = (typedArr.length > answerArr.length) ? typedArr.length - answerArr.length : 0;
        answerArr.forEach((a, i) => {
            if ((typedArr[i] === undefined) || (a !== typedArr[i])) {
                wrongChar++
            }
        })
        if (typed.trim() !== answer) {
            // letterRef.current[TFstate.HLIndex].classList.add("border-b-2", "border-red-500")
            return [false, wrongChar];
        }
        // letterRef.current[TFstate.HLIndex].classList.remove("border-b-2", "border-red-500")
        return [true, wrongChar]
    }





    useEffect(() => {
        let timerInterval: number = 0

        if (TFstate.typingStarted && TFstate.timer !== 0 && enableTimer) {

            timerInterval = window.setInterval(() => {
                if (!TFstate.isPaused) {
                    TFDispatch({ type: ITFActions.DECREASE_TIME })
                }
            }, 1000)
        } else if (TFstate.timer === 0) {
            let [net, accuracy] = calculateTypingSpeed(TPstate.charCount, TPstate.charWrong, typingFieldStates.timer)
            TPDispatch({ type: ITPActions.FINISH, payload: { net, accuracy } })
            TFDispatch({ type: ITFActions.STOP })
            clearInterval(timerInterval)
            // clearInterval(rythmInterval)
        }


        return () => clearInterval(timerInterval)
    }, [TFstate.typingStarted, TFstate.timer, TFstate.isPaused])




    useEffect(() => {
        if (!(mousePressed && !TFstate.inputIsFocus)) return;
        inputRef.current!.focus()
    }, [mousePressed])

    useEffect(() => {
        if (TFstate.typingStarted) setTimeStart(getTimeNow())
        if (!(TFstate.typingStarted && TFstate.timer === 0)) return;
        inputRef.current!.blur()
    }, [TFstate.typingStarted])



    useEffect(() => {
        // console.log(inputRef)
        if (inputRef.current) inputRef.current!.focus()
    }, [])

    const restart = (new_test?: boolean) => {
        if (new_test) reWords()
        setSDList([])
        setRythmWord([])
        restart_letter_styles(TFstate.HLIndex)
        inputRef.current!.value = ""
        inputRef.current!.focus()
        TFDispatch({ type: ITFActions.RESET })
        TPDispatch({ type: ITPActions.RESET })
    }

    const restart_letter_styles = (index: number) => {
        // console.log(index)
        for (let a = 0; a < index; a++) {
            let letter = letterRef.current[a].childNodes as NodeListOf<HTMLElement>

            letter.forEach((l, i) => {
                l.className = ""
            })
        }
    }



    const focusInput = (): void => {
        if (inputRef.current) inputRef.current!.focus()
    }

    const props = {
        input: {
            inputHandler,
            onFocus: () => {
                TFDispatch({ type: ITFActions.FOCUS })
            },
            onBlur: () => TFDispatch({ type: ITFActions.UNFOCUS })
        },
        states: {
            TFstate, TPstate,
            SDList, timeStart
        },
        setter: {
            TFDispatch,
            TPDispatch,
            setSDList,
            setRythmWord
        },
        refs: {
            letterRef, inputRef, exessElContainer, focusCoverRef,
        },
        restart,
        focusInput
    }

    return props
}

export default useTypingField