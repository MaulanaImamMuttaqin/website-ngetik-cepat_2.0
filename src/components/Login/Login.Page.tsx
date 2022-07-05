import React, { FC, useContext, useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { request } from '../../lib/axios/axios'
import parseJWT from '../../utils/parseJWT'
import { storage } from '../../utils/storage'
import { AuthContext } from '../AuthContext/AuthContextProvider'
import { IAuthActions } from '../AuthContext/reducer'



const loginAPI = (data: FormData) => {
    return request({ url: '/auth/token/obtain/', method: 'post', data })
}

const Authenticate = () => {
    const { AuthDispatch } = useContext(AuthContext)

    return useMutation(loginAPI,
        {
            onSuccess: data => {
                storage.setToken(data.data)
                let user_data = parseJWT(data.data.access)
                AuthDispatch({ type: IAuthActions.SET_USER, payload: user_data })
            }
        }
    )
}

const Login: FC = () => {
    const { AuthState: { isRegisterSuccess } } = useContext(AuthContext)
    const formRef = useRef<HTMLFormElement>(null)
    const { data, mutate: authenticate, isLoading, isSuccess } = Authenticate()
    const navigate = useNavigate()

    const handleSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let formData = new FormData(formRef.current!)
        authenticate(formData)
    }

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess])

    return (
        // bg-gradient-to-tl from-[#061e2e] via-[#181c44] to-[#060a2e] to 
        <div className='h-screen bg-transparent  center border border-black'>

            <div className='h-[500px] w-[900px] flex flex-row border-y border-[#061e2e]   center text-gray-700  dark:text-white'>
                <div className='w-2/4 h-full center dark:border-r dark:border-gray-900 dark:bg-gradient-to-r from-[#020817] via-[#020817] to-[#030024]'>
                    <div>
                        <p>Sign in to </p>
                        <h1 className='my-5 text-blue-500 text-6xl text-center font-thin tracking-widest'>TypeR</h1>
                        <p className='text-right'>to use other features such as</p>
                        <p className='text-right'>Multiplayer Gameplay</p>
                        <p className='text-right'>Weakness detection</p>
                    </div>
                </div>
                <form onSubmit={handleSubmitLogin} ref={formRef} className="w-3/4 h-full center flex-col  gap-10 px-10 dark:bg-gradient-to-l from-[#020817] via-[#020817] to-[#030024]">
                    {/* <h1 className='self-start text-3xl'>Sign In</h1> */}
                    <div className=''>
                        <input name='username' type="text" className='text-gray-700  dark:text-gray-200 mb-5 outline-blue-500 bg-transparent border-b border-gray-700 h-14 w-full pl-3' placeholder='Username' required />
                        <input name='password' type="password" className='bg-transparent outline-blue-500 border-b border-gray-700 h-14 w-full pl-3' placeholder='Password' required />
                        <button type='submit' className=' mt-10 px-10 py-2 bg-transparent border-x-2 border-[#181c44] text-white tracking-wide text-xl transition-all hover:bg-[#0e2f46] hover:tracking-widest'>LOGIN</button>
                        <p className='my-5'>Doesn't have an account, Register <a className='text-blue-500 hover:cursor-pointer' onClick={() => navigate('/register')}>here</a></p>
                        {isRegisterSuccess && <p className='text-blue-500 font-bold text-xl'>Account Successfully Registered</p>}

                        <>{isLoading && <p>...Loading</p>}</>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login