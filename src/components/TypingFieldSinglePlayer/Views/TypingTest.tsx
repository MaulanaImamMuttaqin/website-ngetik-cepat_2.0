import React, { useEffect } from 'react'
import { ChevronRightIcon, RefreshIcon } from '@heroicons/react/solid'
import UnFocusCover from './UnFocusCover'
import { ITFProps } from '../../TypingField/Interfaces'
import WordsContainer from '../../TypingField/Views/WordsContainer'

function TypingTest({ ...props }: ITFProps) {

    return (
        <div className='relative z-0'>
            {/* render component ini kalau inputnya sudah gak focus lagi trus componentnya kalau di tekan bisa memfocuskan inputannya lagi */}
            <div className={` p-2 rounded-2xl shadow-2xl`}>
                <div className=" font-semibold tracking-[.1em] text-xl border-b border-white text-blue-500 flex justify-between px-5 mb-5">
                    <span>{props.states.TFstate.HLIndex}</span>
                    {/* <span>{props.states.nextTypedDuration}</span> */}
                    <span onClick={() => props.restart!(true)}> <RefreshIcon className='h-6 w-6' /></span>
                </div>
                <div className='relative h-[350px] w-[400px]'>
                    <UnFocusCover open={(!props.states.TFstate.inputIsFocus && !props.states.TPstate.isFinish) ? true : false} focusInput={props.focusInput} />
                    {(props.states.TPstate.isFinish) &&
                        <div className="absolute h-full w-full center z-10 flex gap-5">
                            <button className="bg-blue-500 text-white  h-[50px] w-[70px] center rounded-full text-4xl font-bold transition hover:bg-blue-700" onClick={() => props.restart!(false)}><RefreshIcon className='h-6 w-6' /></button>
                            <button className="bg-blue-500 text-white  h-[50px] w-[70px] center rounded-full text-4xl font-bold transition hover:bg-blue-700" onClick={() => props.restart!(true)}><ChevronRightIcon className='h-6 w-6' /></button>
                        </div>}
                    {
                        !props.isFetching ?
                            <div className={`${(props.states.TFstate.inputIsFocus && props.states.TPstate.isFinish) && 'blur-md'} h-full w-full overflow-hidden ${props.states.TFstate.timer === 0 && 'blur-md'} `}>
                                <div className='flex flex-col  tracking-[.5em] text-gray-200  transition-all ' style={{ transform: `translateY(${props.states.TFstate.wordPos}px` }}>
                                    {
                                        props.words.map((w: string[], i: number) => {
                                            return <WordsContainer
                                                key={i}
                                                word={w[1]}
                                                isIndex={i === props.states.TFstate.HLIndex}
                                                letterref={props.refs.letterRef}
                                                exessElContainer={props.refs.exessElContainer}
                                                index={i}
                                            />
                                        })
                                    }
                                </div>
                            </div>

                            : <div className="h-full w-full center text-white text-3xl">
                                <p>Loading...</p>
                            </div>
                    }

                </div>

                <textarea className='block h-0' ref={props.refs.inputRef} onChange={props.input.inputHandler}
                    onFocus={props.input.onFocus} onBlur={props.input.onBlur}
                />
            </div>

        </div >
    )
}

export default TypingTest