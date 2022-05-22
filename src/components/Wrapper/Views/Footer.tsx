import React from 'react'

function Footer() {
    return (
        <div className='absolute h-10 w-full center bottom-0 text-white z-20'>
            &copy; Copyright {(new Date().getFullYear())}
        </div>
    )
}

export default Footer