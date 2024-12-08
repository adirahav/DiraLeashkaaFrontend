import React, { createContext, useContext, useState, useEffect } from 'react'
import { userService } from '../services/user.service'

const SplashContext = createContext()

export const SplashProvider = ({ children }) => {
    const [splash, setSplash] = useState(() => {
        const phrases = localStorage.getItem("phrases")
        const fixedParameters = localStorage.getItem("fixedParameters")
        const calculators = localStorage.getItem("calculators")

        return {
            phrases: phrases ? JSON.parse(phrases) : null,
            fixedParameters: fixedParameters ? JSON.parse(fixedParameters) : null,
            calculators: calculators ? JSON.parse(calculators) : null
        }
    })

    const [forceFetchSplash, setForceFetchSplash] = useState(false)

    useEffect(() => {
        if (forceFetchSplash || !splash || !splash.fixedParameters || !splash.phrases) {
            fetchSplash()
        } else {
            localStorage.setItem("phrases", JSON.stringify(splash.phrases))
            localStorage.setItem("fixedParameters", JSON.stringify(splash.fixedParameters))
            localStorage.setItem("calculators", JSON.stringify(splash.calculators))
        }
    }, [splash, forceFetchSplash])

    const fetchSplash = async () => {
        try {
            const splashData = await userService.splash()
            
            setSplash({
                phrases: splashData.phrases,
                fixedParameters: splashData.fixedParameters,
                calculators: splashData.calculators
            })           
        } catch (error) {
            console.error("Failed to fetch splash:", error)
        } finally {
            setForceFetchSplash(false)
        }
    }

    return (
        <SplashContext.Provider value={{ splash, setForceFetchSplash }}>
            {children}
        </SplashContext.Provider>
    )
}

export const useSplash = () => useContext(SplashContext)
