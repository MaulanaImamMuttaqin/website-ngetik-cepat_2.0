import React, { Dispatch, useEffect, useState } from 'react'

const useDarkSide = (): [string, Dispatch<any>] => {
    const [theme, setTheme] = useState(localStorage.theme)
    const colorTheme = theme === "dark" ? 'light' : 'dark';

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(colorTheme);
        root.classList.add(theme)

        localStorage.setItem('theme', theme)
    }, [theme, colorTheme])



    return [colorTheme, setTheme]
}

export default useDarkSide