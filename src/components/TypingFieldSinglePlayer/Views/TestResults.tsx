
import { ITFState, ITPState } from '../../TypingField/Interfaces'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'
import React, { useEffect, useState } from 'react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';



ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
export const options = {
    responsive: true,
    scales: {
        yAxis: {
            min: 0,
            max: 100,
        }
    },
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Rythm Stability',
        },
    },
};


function TestResults({ ...props }: { TFstate: ITFState, TPstate: ITPState, SDList: Array<any> }) {
    const [showDetail, setShowDetail] = useState<boolean>(false)
    let reversed = props.SDList.slice().reverse()
    let sorted = [...props.SDList].sort((a: any, b: any) => {
        return a.standDeviation - b.standDeviation;
    }).slice().reverse()

    useEffect(() => {
        console.log(props.TPstate.isFinish)
    }, [props.TPstate.isFinish])
    return (
        <>
            <div className={`h-[370px] w-[450px] p-10 ml-10 ${!(props.TPstate.isFinish) && 'translate-y-10 opacity-0 w-0 p-0 ml-0'} overflow-hidden  transition-all  dark:text-white flex flex-col items-center justify-between border border-white rounded-xl`}>
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
                                {props.SDList.map((w: any, i) => (
                                    <p key={i}><span className='text-red-500'>{i + 1}</span> --{w.word} : {w.calcStanDev}</p>
                                ))}
                            </div>
                        </div>
                    </>
                }
                <div onClick={() => setShowDetail(!showDetail)} className="center my-1 hover:cursor-pointer px-5 py-1 rounded-lg  hover:bg-blue-900 hover:text-white transition-colors duration-100">
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
            <div className={`h-[370px] w-[450px] px-5 ml-10 ${(props.TPstate.isFinish) && 'translate-y-10 opacity-0 w-0 p-0 ml-0'} overflow-hidden  transition-all  text-white border border-white rounded-xl`}>
                <div className='text-left w-full h-full center flex-col pt-2 overflow-y-auto'>
                    {
                        reversed.length > 0 &&
                        <>
                            <Line
                                options={options}
                                data={{
                                    labels: reversed[0].rythm.map((r: number, i: number) => i),
                                    datasets: [
                                        {
                                            label: 'Dataset 1',
                                            data: reversed[0].rythm,
                                            borderColor: 'rgb(255, 99, 132)',
                                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                        },
                                    ],
                                }} />
                            <p className='text-center text-gray-900 dark:text-white'>score: {reversed[0].calcStanDev}</p>
                            <p className='text-center text-gray-900 dark:text-white'>SD: {reversed[0].standDeviation}</p>
                        </>
                    }
                </div>
            </div>
            {/* <div className={`h-[370px] w-[450px] p-10 ml-10 ${(props.TPstate.isFinish) && 'translate-y-10 opacity-0 w-0 p-0 ml-0'} overflow-hidden  transition-all  text-white flex flex-col items-center justify-between border border-white rounded-xl`}>
                <div className='flex  border border-white flex-col w-full h-full pt-10'>
                    <pre>{JSON.stringify(reversed, null, 4)}</pre>
                </div>
            </div> */}
        </>
    )
}

export default TestResults