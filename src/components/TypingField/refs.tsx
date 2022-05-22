import React, { Ref, useRef } from 'react'

function Refs() {
    const letterRef = useRef<Array<HTMLDivElement>>([])
    const inputRef = useRef<HTMLInputElement>()
    const exessElContainer = useRef<Array<HTMLSpanElement>>([])
    const focusCoverRef = useRef()

    return { letterRef, inputRef, exessElContainer, focusCoverRef }
}

export default Refs