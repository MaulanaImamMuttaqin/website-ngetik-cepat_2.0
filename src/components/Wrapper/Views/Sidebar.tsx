import React from 'react'
import { ChevronRightIcon, ChevronDoubleRightIcon, UserGroupIcon } from '@heroicons/react/solid'
import { useNavigate } from 'react-router-dom'




function Sidebar() {
    const navigate = useNavigate()
    return (
        <div id="sidebar" className='absolute w-32 h-screen  transition duration-500  translate -translate-x-full z-20'>
            <div className="h-full w-full  flex items-center ">
                <div className='h-auto py-5 w-full flex flex-col gap-10 justify-around items-center border-r-4 border-blue-500'>
                    <div onClick={() => navigate('/')} className="h-14 w-14 rounded-full border border-gray-800 transition ease-in-out duration-300 hover:cursor-pointer hover:bg-blue-500 center text-blue-500 hover:text-gray-800">
                        <ChevronRightIcon className='h-8 w-8' />
                    </div>
                    <div onClick={() => navigate('/type-practice')} className="h-14 w-14 rounded-full border border-gray-800 transition ease-in-out duration-300 hover:cursor-pointer hover:bg-blue-500 center text-blue-500 hover:text-gray-800">
                        <ChevronDoubleRightIcon className='h-8 w-8' />
                    </div>
                    <div onClick={() => navigate('/type-multiplayer')} className="h-14 w-14 rounded-full border border-gray-800 transition ease-in-out duration-300 hover:cursor-pointer hover:bg-blue-500 center text-blue-500 hover:text-gray-800">
                        <UserGroupIcon className='h-8 w-8' />
                    </div>

                </div>

                <div className='h-14 w-14 absolute transition translate-x-[210%]  text-white center rounded-full '>
                    <ChevronRightIcon className='text-blue-500' />
                </div>
            </div>
        </div>
    )
}

export default Sidebar