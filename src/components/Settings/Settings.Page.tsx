import React from 'react'
import useDarkSide from '../../customHooks/useDarkSide'

function Settings() {

    const [colorTheme, setTheme] = useDarkSide()

    return (
        <div className='h-screen center'>
            <div className="w-screen h-5/6 p-10 px-40 text-blue-500  dark:text-white">
                <h1 className="text-3xl border-b dark:border-gray-400 pb-5 mb-5 ">Settings</h1>
                <div className='pl-10'>
                    <h2 className="text-xl mb-5">Theme:</h2>
                    <button onClick={() => setTheme('light')} className='h-10 w-20 rounded-lg bg-gray-200 text-blue-500 mr-5 font-bold'>Light</button>
                    <button onClick={() => setTheme('dark')} className='h-10 w-20 rounded-lg bg-dark-blue text-white font-bold border'>Dark</button>
                </div>
            </div>
        </div>
    )
}

export default Settings