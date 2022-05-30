import { RefObject } from "react"

export enum ITFActions {
    SPACED = 'SPACED',
    TYPED = 'TYPED',
    START = 'START',
    STOP = 'STOP',
    FOCUS = 'FOCUS',
    UNFOCUS = 'UNFOCUS',
    DECREASE_TIME = 'DECREASE_TIME',
    RESET = 'RESET',
}


export interface ITFState {
    wordPos: number,
    HLIndex: number,
    wordTyped: string,
    typingStarted: boolean,
    inputIsFocus: boolean,
    timer: number,
    isPaused: boolean
}


export enum ITPActions {
    CORRECT = 'CORRECT',
    INCORRECT = 'INCORRECT',
    CHAR = 'CHAR',
    CALCULATE = 'CALCULATE',
    SHOW = 'SHOW',
    RESET = 'RESET',
    UPLOAD = 'UPLOAD',
    STOP_UPLOAD = 'STOP_UPLOAD',
}

export interface ITPState {
    charCount: number,
    charWrong: number,
    wordCount: number,
    wordWrong: number,
    wordCorrect: number,
    speed: number,
    accuracy: number,
    showPerformance: boolean,
    upload: boolean

}


export interface ITFProps {
    words: Array<string>
    isLoading: boolean,
    isFetching: boolean,
    input: {
        inputRef: RefObject<HTMLInputElement>,
        inputHandler: () => void,
        onFocus: () => void,
        onBlur: () => void
    },
    states: {
        TFstate: ITFState,
        TPstate: ITPState,
        nextTypedDuration: number,
        lpsDisplay: Array<number>
    },
    refs: {
        letterRef: RefObject<Array<HTMLDivElement>>,
        exessElContainer: RefObject<Array<HTMLSpanElement>>,
        focusCoverRef?: RefObject<null>,
    }
    restart: (new_test?: boolean) => void,
    focusInput: () => void
}