export interface IAuthState {
    isLoggedIn: boolean,
    userData: any,
}

export enum IAuthActions {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    SET_USER = 'SET_USER'
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
            }
        case IAuthActions.LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
            }
        case IAuthActions.SET_USER:
            return {
                ...state,
                isLoggedIn: true,
                userData: payload,
                // token: payload.token,
                // isLoggedIn: true
            }
        default:
            return state;
    }
}

