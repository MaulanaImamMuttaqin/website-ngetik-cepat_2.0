import React, { Ref, useRef } from 'react'

function Refs() {
    const letterRef = useRef<Array<HTMLDivElement>>([])
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const exessElContainer = useRef<Array<HTMLSpanElement>>([])
    const focusCoverRef = useRef(null)

    return { letterRef, inputRef, exessElContainer, focusCoverRef }
}

export default Refs