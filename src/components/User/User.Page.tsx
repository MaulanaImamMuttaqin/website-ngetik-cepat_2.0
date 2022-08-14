import React, { useContext, useEffect, useState } from 'react'
import { ChevronRightIcon } from '@heroicons/react/solid'


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
import { useMutation, useQuery } from 'react-query';
import { request } from '../../lib/axios/axios';
import { AuthContext } from '../AuthContext/AuthContextProvider';



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


function User() {
    const [nav, setNav] = useState<number>(0)


    return (
        <div className='h-screen center'>
            <div className="w-5/6 h-5/6 p-5  text-blue-500  dark:text-white flex flex-col">
                <h1 className="text-3xl border-b dark:border-gray-400 pb-5 mb-5 ">User</h1>
                <div className="h-full w-full flex">
                    <div className='w-1/5 border-r'>
                        <NavigationIcon text="Details" hl={nav === 0} nav={() => setNav(0)} />
                        <NavigationIcon text="Tests" hl={nav === 1} nav={() => setNav(1)} />

                    </div>
                    <div className='w-4/5 p-10 overflow-y-auto'>
                        {
                            nav === 0 ? <DetailView /> :
                                nav === 1 && <HistoryView />

                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


const DetailView = () => {

    const { AuthState: {
        userData
    } } = useContext(AuthContext)
    return (
        <div className=' text-2xl flex flex-col gap-5'>
            <div className=' flex justify-between'>
                <span>Username:</span>
                <span> {userData.username}</span>
            </div>
            <div className=' flex justify-between'>
                <span>Test Taken:</span>
                <span> 120</span>
            </div>
            <div className=' flex justify-between'>
                <span>Last Login:</span>
                <span>55 minutes ago</span>
            </div>
        </div>
    )
}

const HistoryView = () => {
    const { AuthState: {
        userData
    } } = useContext(AuthContext)
    const result_api = (data: any) => {
        return request({ url: `/api/test_result/${userData.user_id}`, method: 'get', data })
    }
    const { data: results, isFetching, isLoading } = useQuery('test_results', result_api, {
        select: data => data.data
    })

    useEffect(() => {
        console.log(results)
    }, [isFetching])

    return (
        <div className=' text-md flex flex-col gap-2'>
            <div className=' flex justify-between'>
                <span>Top Speed:</span>
                <span>{results?.top_speed} KPM </span>
            </div>
            <div className=' flex justify-between'>
                <span>Lowest Speed:</span>
                <span> {results?.low_speed}  KPM</span>
            </div>
            <div className=' flex justify-between'>
                <span>Average Speed:</span>
                <span> {results?.avg}  KPM</span>
            </div>
            <div className=' flex flex-col'>
                <span>Charts:</span>
                <div className='text-left w-full h-full center flex-col pt-2 overflow-y-auto'>
                    {isFetching ? <p>Loading</p> :

                        <Line
                            options={options}
                            data={{
                                labels: results?.speeds.map((r: any, i: number) => new Date(r.timestamp).toLocaleString()),
                                datasets: [
                                    {
                                        label: 'kecepatan',
                                        data: results?.speeds.map((r: any) => r.speed),
                                        borderColor: 'rgb(255, 99, 132)',
                                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                    },
                                ],
                            }} />
                    }
                </div>
            </div>

        </div>
    )
}
const NavigationIcon = ({ text, nav, hl }: { text: any, hl: boolean, nav: () => void }) => {
    return (
        <div onClick={nav} className={`flex justify-between items-center hover:bg-blue-300 ${hl && 'bg-blue-500 text-white font-bold'} transition-bg duration-75 hover:cursor-pointer px-5 py-5 `}>
            <span className='text-xl'>
                {text}
            </span>
            <ChevronRightIcon className='h-5 w-5' />
        </div>
    )
}
export default User