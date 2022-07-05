export interface IAuthState {
    isLoggedIn: boolean,
    userData: any,
    isRegisterSuccess: boolean
}

export enum IAuthActions {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    SET_USER = 'SET_USER',
    REGISTER = 'REGISTER'
}

export interface IAction {
    type: IAuthActions,
    payload?: any;
}

export const authReducer = (state: IAuthState, action: IAction) => {
    const { type, payload } = action
    switch (type) {
        case IAuthActions.LOGIN:
            return {
                ...state,
                isLoggedIn: true,
                isRegsiterSucces: false,
            }
        case IAuthActions.LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                userData: {}
            }
        case IAuthActions.SET_USER:
            return {
                ...state,
                isLoggedIn: true,
                userData: payload,
                // token: payload.token,
                // isLoggedIn: true
            }
        case IAuthActions.REGISTER:
            return {
                ...state,
                isRegisterSuccess: true
            }
        default:
            return state;
    }
}

