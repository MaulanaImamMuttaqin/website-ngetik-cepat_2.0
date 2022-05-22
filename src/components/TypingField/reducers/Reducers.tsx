import React, { useReducer } from 'react'
import typingFieldStates from '../states/typingFieldStates'
import typingPerformanceStates from '../states/typingPerformanceStates'
import { typingFieldReducer } from './typingFieldReducer'
import { typingPerformanceReducer } from './typingPerformanceReducer'

function Reducers() {
    const [TFstate, TFDispatch] = useReducer(typingFieldReducer, typingFieldStates)
    const [TPstate, TPDispatch] = useReducer(typingPerformanceReducer, typingPerformanceStates)

    return {
        TFstate, TPstate, TFDispatch, TPDispatch
    }
}

export default Reducers