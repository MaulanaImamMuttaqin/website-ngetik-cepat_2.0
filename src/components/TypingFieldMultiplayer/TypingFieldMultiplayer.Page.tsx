import React, { useContext } from 'react'
import { AuthContext } from '../AuthContext/AuthContextProvider'
import TypingField from '../TypingField/TypingField.Page'

function TypingFieldMultiplayer() {
    const { AuthState } = useContext(AuthContext)

    return (
        <div className="text-white h-screen center flex-col bg-dark-blue-gradient">
            {
                AuthState.isLoggedIn ?
                    <>
                        <div>this is a typing field multiplayer</div>
                        <div>it's still in development</div>
                        <div>please wait</div>
                    </> :
                    <>
                        <div>You're not Logged In</div>
                        <div>Please Logged in to use this features</div>
                    </>
            }
        </div>
    )
}

export default TypingFieldMultiplayer