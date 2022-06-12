import React from "react"
import { ITFActions } from "../Enums"
import { ITFState } from "../Interfaces"
import typingFieldStates from "../states/typingFieldStates"


interface IAction {
    type: ITFActions;
    payload?: any;
}

enum ITRActions {
    STRT_INTRVL = 'SPACED',
    TYPED_DUR = 'TYPED',
    RYTHM_W = 'START',
    ADD_SD = 'STOP',
    FOCUS = 'FOCUS',
    UNFOCUS = 'UNFOCUS',
    DECREASE_TIME = 'DECREASE_TIME',
    RESET = 'RESET',
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

        default:
            return state;
    }
}
