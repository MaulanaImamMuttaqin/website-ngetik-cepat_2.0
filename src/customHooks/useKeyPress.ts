import React, { useEffect, useState } from 'react'

const useKeyPress = (targetKey: string, event: string, reference: any) => {
    const [keyPressed, setKeyPressed] = useState(false);
    type handler = {
        key: string
    }
    const downHandler = (handler: handler) => {
        if (event === 'mouse') {
            setKeyPressed(true)
            // console.log(handler.key)
        }
        else if (targetKey.includes(handler.key)) {
            // console.log(handler.key)
            setKeyPressed(true)
        };
    };

    const upHandler = (handler: handler) => {
        if (event === 'mouse') setKeyPressed(false)
        else if (targetKey.includes(handler.key)) {
            setKeyPressed(false)
        };
    };


    useEffect(() => {

        reference.addEventListener(`${event}down`, downHandler);
        reference.addEventListener(`${event}up`, upHandler);

        return () => {
            reference.removeEventListener(`${event}down`, downHandler);
            reference.removeEventListener(`${event}up`, upHandler);
        };
    }, []);

    return keyPressed;

};

export default useKeyPress
