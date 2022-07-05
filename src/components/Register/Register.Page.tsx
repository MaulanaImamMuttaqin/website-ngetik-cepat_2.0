import React, { useContext, useEffect, useRef, useState } from 'react'
import { useMutation, useQueryErrorResetBoundary } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { request } from '../../lib/axios/axios'
import { AuthContext } from '../AuthContext/AuthContextProvider'
import { IAuthActions } from '../AuthContext/reducer'


const registApi = (data: FormData) => {
    return request({ url: '/auth/register/', method: 'post', data })
}

const RegisterQuery = () => {
    const { AuthDispatch } = useContext(AuthContext)
    return useMutation(registApi,

        {
            onSuccess: data => {
                console.log(data)
                if (!data.data) throw "error bad request";
                // storage.setToken(data.data)
                // let user_data = parseJWT(data.data.access)
                AuthDispatch({ type: IAuthActions.REGISTER })
            },
            onError: error => {
                console.log(error)
            }
        }
    )
}

function Register() {
    const formRef = useRef<HTMLFormElement>(null)
    const { data, mutate: regist, isLoading, isSuccess, isError } = RegisterQuery()
    const navigate = useNavigate()
    const [pass1, setPass1] = useState("")
    const [pass2, setPass2] = useState("")
    const [user, setUser] = useState("")
    const [confirmPass, setConfirmPass] = useState<boolean>(true)
    const [confirmUser, setConfirmUser] = useState<boolean>(true)

    const handleSubmitRegist = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let formData = new FormData(formRef.current!)
        for (const data of formData.entries()) {
            console.log(data[0], data[1])
        }
        regist(formData)
    }
    const containsWhitespace = (str: string) => {
        return /\s/.test(str);
    }

    useEffect(() => {
        if (isError) return;
        if (isSuccess) navigate('/login')
    }, [isSuccess, isError])

    useEffect(() => {
        if (!containsWhitespace(user)) setConfirmUser(true)
        else setConfirmUser(false)


        if (pass2 === "") return
        if ((pass1 === pass2)) setConfirmPass(true)
        else setConfirmPass(false)

    }, [pass2, user])

    return (
        // bg-gradient-to-tl from-[#061e2e] via-[#181c44] to-[#060a2e] to 
        <div className='h-screen bg-transparent  center border border-black'>

            <div className='h-[500px] w-[900px] flex flex-row border-y border-[#061e2e]   center  dark:text-white overflow-y-auto'>

                <form onSubmit={handleSubmitRegist} ref={formRef} className="w-full h-full flex flex-col  gap-10 p-10 dark:bg-gradient-to-l from-[#020817] via-[#030024] to-[#020817]">
                    <div>
                        <h1 className='text-3xl text-left'> Sign Up at <span className='my-5 text-blue-500  font-thin tracking-widest'>TypeR</span></h1>
                        <p className='mt-1'>Already have an account, Sign In <a className='text-blue-500 hover:cursor-pointer' onClick={() => navigate('/login')}>here</a></p>
                    </div>
                    <div className='flex flex-col gap-5 w-full'>
                        <input value={user} onChange={e => setUser(e.target.value)} name='username' type="text" className=' w-2/4  outline-blue-500 bg-transparent border-b border-gray-700 h-14 pl-3' placeholder='Username' required />
                        {isError && <small className='text-red-500'>Username already exist</small>}
                        {!confirmUser && <small className='text-red-500 text-sm'>Username cannot contains any space</small>}
                        <input value={pass1} onChange={e => setPass1(e.target.value)} name='password' type="password" className=' w-2/4 bg-transparent outline-blue-500 border-b border-gray-700 h-14 pl-3' placeholder='Password' required />
                        <input value={pass2} onChange={e => setPass2(e.target.value)} name='password2' type="password" className=' w-2/4 bg-transparent outline-blue-500 border-b border-gray-700 h-14 pl-3' placeholder='Confirm Password' required />
                        {!confirmPass && <small className='text-red-500 text-sm'>Password needs to be the same </small>}
                        <button type='submit' className='w-[200px] mt-5 px-10 py-2 bg-transparent border-x-2 border-[#181c44] dark:text-white tracking-wide text-xl transition-all hover:bg-[#0e2f46] hover:tracking-widest'>Register</button>

                        <>{isLoading && <p>...Loading</p>}</>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register