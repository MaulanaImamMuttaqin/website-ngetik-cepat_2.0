
import { ITFState, ITPState } from '../../TypingField/Interfaces'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'
import React, { useState } from 'react'


function TestResults({ ...props }: { TFstate: ITFState, TPstate: ITPState, SDList: Array<string> }) {
    const [showDetail, setShowDetail] = useState<boolean>(false)
    let reversed = props.SDList.slice().reverse()
    let sorted = [...props.SDList].sort((a: any, b: any) => {
        return a.standDeviation - b.standDeviation;
    }).slice().reverse()
    return (
        <>
            <div className={`h-[370px] w-[450px] p-10 ml-10 ${!(props.TFstate.timer === 0 && !props.TFstate.typingStarted) && 'translate-y-10 opacity-0 w-0 p-0 ml-0'} overflow-hidden  transition-all  text-white flex flex-col items-center justify-between border border-white rounded-xl`}>
                <h1 className='text-3xl font-semibold'>Typing Result</h1>
                {!showDetail ?

                    <>
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
                        </div>
                    </> :

                    <>
                        <div className=" w-full p-5 overflow-y-auto">
                            <h2 className="tracking-wide font-semibold">this some of the word you might struggle</h2>
                            <div className="p-2">
                                {sorted.map((w: any, i) => (
                                    <p key={i}>{w.word} : {w.standDeviation}</p>
                                ))}
                            </div>
                        </div>
                    </>
                }
                <div onClick={() => setShowDetail(!showDetail)} className="center my-1 hover:cursor-pointer px-5 py-1 rounded-lg hover:bg-blue-900 transition-colors duration-100">
                    {!showDetail ?
                        <>
                            detail <ChevronDownIcon className='h-5 w-5 font-bold' />
                        </> :
                        <>
                            close detail <ChevronUpIcon className='h-5 w-5 font-bold' />
                        </>
                    }
                </div>

            </div>
            <div className={`h-[370px] w-[450px] p-10 ml-10 ${(props.TFstate.timer === 0 && !props.TFstate.typingStarted) && 'translate-y-10 opacity-0 w-0 p-0 ml-0'} overflow-hidden  transition-all  text-white flex flex-col items-center justify-between border border-white rounded-xl`}>
                <div className='flex  border border-white flex-col w-full h-full pt-10'>
                    <pre>{JSON.stringify(reversed, null, 4)}</pre>
                </div>
            </div>
        </>
    )
}

export default TestResults