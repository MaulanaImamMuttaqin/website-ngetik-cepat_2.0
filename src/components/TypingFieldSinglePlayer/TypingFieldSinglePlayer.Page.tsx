import React from 'react'
import TypingField from '../TypingField/TypingField.Page'
import { Fetch_Words } from './Queries'
import TestResults from './Views/TestResults'
import TypingTest from './Views/TypingTest'
import UnFocusCover from './Views/UnFocusCover'

function TypingFieldSinglePlayer() {
    const query = Fetch_Words()
    // const { data: words, isLoading, isFetching, refetch } = Fetch_Words()

    return (
        <TypingField query={query}>

            {(props: any) => (
                <>

                    <TypingTest {...props} />
                    <TestResults {...props.states} />
                </>
            )}
        </TypingField>
    )
}

export default TypingFieldSinglePlayer