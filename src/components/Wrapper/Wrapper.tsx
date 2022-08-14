import React, { useContext, useEffect } from 'react'
import useDarkSide from '../../customHooks/useDarkSide'
import { AuthContext } from '../AuthContext/AuthContextProvider'
import Footer from './Views/Footer'
import Header from './Views/Header'
import Sidebar from './Views/Sidebar'

function Wrapper({ children }: { children: JSX.Element }) {
    useDarkSide()


    return (
        <div className='transition-color duration-100 h-screen w-screen overflow-hidden  dark:bg-dark-blue-gradient bg-gray-100' >
            <Header />
            <Sidebar />
            {children}
            <Footer />
        </div>
    )
}

export default Wrapper