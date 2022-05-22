import React from "react"
import { ITFActions } from "../Enums"
import { ITFState } from "../Interfaces"
import typingFieldStates from "../states/typingFieldStates"


interface IAction {
    type: ITFActions;
    payload?: any;
}

export const typingFieldReducer = (state: ITFState, action: IAction) => {
    const { type, payload } = action
    switch (type) {
        case ITFActions.SPACED:
            return {
                ...state,
                wordPos: state.wordPos - 50,
                HLIndex: state.HLIndex + 1,
            }
        case ITFActions.TYPED:
            return {
                ...state,
                wordTyped: payload
            }
        case ITFActions.START:
            return {
                ...state,
                typingStarted: true
            }
        case ITFActions.STOP:
            return {
                ...state,
                typingStarted: false,
            }
        case ITFActions.FOCUS:
            return {
                ...state,
                inputIsFocus: true,
                isPaused: false
            }
        case ITFActions.UNFOCUS:
            return {
                ...state,
                inputIsFocus: false,
                isPaused: true
            }
        case ITFActions.DECREASE_TIME:
            return {
                ...state,
                timer: state.timer - 1
            }
        case ITFActions.RESET:
            return {
                ...typingFieldStates
            }
        default:
            return state;
    }
}
