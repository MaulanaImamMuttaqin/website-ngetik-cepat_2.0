import React, { RefObject } from 'react'


type words_container = {
    letterref: RefObject<Array<HTMLDivElement>>,
    exessElContainer: RefObject<Array<HTMLSpanElement>>,
    isIndex: boolean,
    index: number,
    word: string
}


const WordsContainer = React.memo(({ ...props }: words_container) => {
    return (
        <div className={`transition-all text-center  h-[50px] center word-${props.isIndex ? 'highlight-light' : 'normal-light'}  dark:${props.isIndex ? 'text-white text-4xl' : 'normal'} font-semibold`}>
            <div ref={(el: HTMLDivElement) => (props.letterref.current![props.index] = el)} className="">
                {props.word.split("").map((l: any, i: any) => {
                    return <span key={i}>{l}</span>
                })}
                <span ref={(el: HTMLSpanElement) => props.exessElContainer.current![props.index] = el} id="excessive"></span>
            </div>
        </div>
    )
})

export default WordsContainer