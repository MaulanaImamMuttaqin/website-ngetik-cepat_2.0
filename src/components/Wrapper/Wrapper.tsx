import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../AuthContext/AuthContextProvider'
import Footer from './Views/Footer'
import Header from './Views/Header'
import Sidebar from './Views/Sidebar'

function Wrapper({ children }: { children: JSX.Element }) {
    const { AuthState } = useContext(AuthContext)

    useEffect(() => {
        console.log(AuthState)
    }, [])
    return (
        <div className='h-screen w-screen overflow-hidden bg-dark-blue-gradient' >
            <Header />
            <Sidebar />
            {children}
            <Footer />
        </div>
    )
}

export default Wrapper