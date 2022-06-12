import { ITPActions, ITPState } from "../Interfaces";
import typingPerformanceStates from "../states/typingPerformanceStates"




interface Action {
    type: ITPActions;
    payload?: any;
}

export const typingPerformanceReducer = (state: ITPState, action: Action) => {
    const { type, payload } = action
    switch (type) {
        case ITPActions.CORRECT:
            return {
                ...state,
                wordCorrect: state.wordCorrect + 1,
                wordCount: state.wordCount + 1,
                charWrong: state.charWrong + payload,
                charCount: state.charCount + 1,
            }
        case ITPActions.INCORRECT:
            return {
                ...state,
                wordWrong: state.wordWrong + 1,
                wordCount: state.wordCount + 1,
                charWrong: state.charWrong + payload,
                charCount: state.charCount + 1,
            }
        case ITPActions.CHAR:
            return {
                ...state,
                charCount: state.charCount + 1,
            }
        case ITPActions.CALCULATE:
            return {
                ...state,
                speed: payload.net,
                accuracy: payload.accuracy
            }
        case ITPActions.SHOW:
            return {
                ...state,
                showPerformance: true
            }
        case ITPActions.RESET:
            return {
                ...typingPerformanceStates
            }
        case ITPActions.UPLOAD:
            return {
                ...state,
                upload: true
            }
        case ITPActions.STOP_UPLOAD:
            return {
                ...state,
                upload: false
            }
        case ITPActions.FINISH:
            return {
                ...state,
                upload: true,
                showPerformance: true,
                speed: payload.net,
                accuracy: payload.accuracy
            }
        default:
            return state;
    }
}
