import React, { useContext, useEffect, useState } from 'react'
import { UserIcon } from '@heroicons/react/solid'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../AuthContext/AuthContextProvider'
import { IAuthActions } from '../../AuthContext/reducer'
function Header() {
    const navigate = useNavigate()
    const { AuthState, AuthDispatch } = useContext(AuthContext)

    const logout = () => {
        let signout = window.confirm("Keluar dari Akun Anda?")
        if (!signout) return;
        AuthDispatch({ type: IAuthActions.LOGOUT })
        navigate('/')
    }
    return (
        <div className='absolute w-screen h-20 flex items-center text-white justify-between px-10 z-30'>
            <div className='hover:cursor-pointer'>Title</div>
            <div id="profile" className='flex items-center gap-5 relative  h-full hover:cursor-pointer'>
                <div className='rounded-full h-12 w-12 center p-1 '><UserIcon className='h-8 w-8' /></div>
                <div id="profile-dropdown" className="backdrop-blur-sm border border-white w-60 h-auto top-[50px] opacity-0 invisible right-0  absolute rounded-lg p-5 transition-all">
                    {
                        AuthState.isLoggedIn &&
                        <div className='mb-5'>
                            <p>Hello, </p>
                            <p className="truncate  font-bold w-68 ">{AuthState.userData?.username}</p>
                        </div>
                    }
                    <ul>
                        {
                            AuthState.isLoggedIn &&
                            <>
                                <li className='px-4 py-2 hover:bg-gray-600 hover:text-white hover:cursor-pointer'>Settings</li>
                                <li className='px-4 py-2 hover:bg-gray-600 hover:text-white hover:cursor-pointer'>User</li>
                            </>
                        }
                        {
                            AuthState.isLoggedIn ?
                                <li className='px-4 py-2 hover:bg-gray-600 hover:text-white hover:cursor-pointer' onClick={logout}>Sign Out</li> :
                                <li className='px-4 py-2 hover:bg-gray-600 hover:text-white hover:cursor-pointer' onClick={() => navigate('/login')}>Sign In</li>
                        }
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default Header