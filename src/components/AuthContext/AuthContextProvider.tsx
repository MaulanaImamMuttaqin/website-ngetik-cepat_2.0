import React, { createContext, Dispatch, useEffect, useReducer } from 'react'
import { useMutation, useQuery } from 'react-query'
import { request } from '../../lib/axios/axios'
import parseJWT from '../../utils/parseJWT'
import { storage } from '../../utils/storage'
import { authReducer, IAction, IAuthActions, IAuthState } from './reducer'
import authStates from './states'


interface IAuthContext {
  AuthState: IAuthState,
  AuthDispatch: Dispatch<IAction>
}

const initialContext = {
  AuthState: authStates,
  AuthDispatch: () => { }
}
export const AuthContext = createContext<IAuthContext>(initialContext)


const refreshToken = () => {
  const refToken = storage.getToken()?.refresh
  return request({ url: '/auth/token/refresh', method: 'post', data: { refresh: refToken } })
}

function AuthContextProvider({ children }: { children: JSX.Element }) {
  const [AuthState, AuthDispatch] = useReducer(authReducer, authStates)
  const { mutate: refresh } = useMutation(refreshToken,
    {
      onSuccess: data => {
        storage.setToken(data.data)
      },
      onError: () => {
        storage.clearToken()
        AuthDispatch({ type: IAuthActions.LOGOUT })
      }
    }
  )

  useEffect(() => {
    if (!storage.getToken()) return;
    let user_data = parseJWT(storage.getToken().access)
    AuthDispatch({ type: IAuthActions.SET_USER, payload: user_data })
  }, [])


  useEffect(() => {
    let interval: number = 0
    if (!AuthState.isLoggedIn) return clearInterval(interval);
    interval = window.setInterval(refresh, 900000)
    return () => clearInterval(interval)
  }, [AuthState])

  return (
    <AuthContext.Provider value={{ AuthState, AuthDispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider  