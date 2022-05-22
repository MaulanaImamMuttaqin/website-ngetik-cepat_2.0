import React, { useEffect, useRef } from 'react'
import { ITFState, ITPState } from '../../TypingField/Interfaces'

function TestResults({ ...props }: { TFstate: ITFState, TPstate: ITPState, wordStuckList: Array<string> }) {
    // const wordRef = useRef<HTMLDivElement>(null);
    // useEffect(() => {
    //     console.log("test")
    //     wordRef.current?.scrollIntoView({ behavior: 'smooth' })
    // }, [props.wordStuckList])
    return (
        <div className={`h-[370px] w-[450px] p-10 ml-10 ${(props.TFstate.timer === 0 && !props.TFstate.typingStarted) && 'translate-y-10 opacity-0 w-0 p-0 ml-0'} overflow-hidden  transition-all  text-white flex flex-col items-center justify-between border border-white rounded-xl`}>
            {/* <h1 className='text-3xl font-semibold'>Typing Result</h1>
            <div className=" w-full p-5">
                <p className='flex justify-between'><span>Word Typed:</span> <span>{props.TPstate.wordCount}</span></p>
                <p className='flex justify-between'><span>Correct Word:</span> <span>{props.TPstate.wordCorrect}</span></p>
                <p className='flex justify-between'><span>Wrong Word:</span> <span>{props.TPstate.wordWrong}</span></p>
                <p className='flex justify-between'><span>Character Typed:</span> <span>{props.TPstate.charCount}</span></p>
                <p className='flex justify-between'><span>Incorrect Character:</span> <span>{props.TPstate.charWrong}</span></p>
                <p className='flex justify-between'><span>Accuracy</span> <span>{props.TPstate.accuracy} %</span></p>
            </div>
            <div className="center text-6xl  font-bold text-blue-500 ">
                <p>{props.TPstate.speed} KPM</p>
            </div> */}
            <div className='flex  border border-white flex-col w-full h-full pt-10'>
                {props.wordStuckList.slice().reverse().map((w, i) => {
                    return <div key={i}>{w}</div>
                })}
            </div>
        </div>
    )
}

export default TestResults