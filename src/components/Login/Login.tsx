import React, { FC, useRef } from 'react'
import { useAuth } from '../../lib/react-query-auth/react-query-auth'



const Login: FC = () => {
    const formRef = useRef<HTMLFormElement>(null)
    const { login } = useAuth();
    const handleSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let formData = new FormData(formRef.current!)
        login(formData)
    }

    return (
        <div className='h-screen bg-gradient-to-tl from-[#061e2e] via-[#181c44] to-[#060a2e] to  center border border-black'>
            <div className='h-[500px] w-[400px] border-x border-[#061e2e]  shadow-lg shadow-[#061e2e] center flex-col gap-5 text-white'>
                <div className='center flex-col mb-14'>
                    <h1 className='text-5xl font-thin tracking-widest'>TypeR</h1>
                </div>
                <form onSubmit={handleSubmitLogin} ref={formRef} className="center flex-col w-full gap-5">
                    <input name='username' type="text" className='bg-transparent border-b border-white h-14 w-3/4 pl-3' placeholder='Username' required />
                    <input name='password' type="text" className='bg-transparent border-b border-white h-14 w-3/4 pl-3' placeholder='Password' required />
                    <button type='submit' className='mt-10 px-10 py-2 bg-transparent border-x-2 border-[#181c44] text-white tracking-wide text-xl transition-all hover:bg-[#0e2f46] hover:tracking-widest'>LOGIN</button>
                </form>
            </div>
        </div>
    )
}

export default Login