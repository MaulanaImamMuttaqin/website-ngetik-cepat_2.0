import React from 'react'

function UnFocusCover({ open, focusInput }: { open: boolean, focusInput: () => void }) {

    return (
        <div onClick={() => focusInput()} className={`h-${open ? 'full' : '0 invisible'} text-center w-full absolute backdrop-blur-lg center  top-0 left-0 z-10  overflow-hidden `}>
            <p className='text-2xl font-semibold text-gray-50 '>clicked <span className='text-blue-500 font-bold'>here</span>  anywhere to continue typing</p>
        </div>
    )
}

export default UnFocusCover