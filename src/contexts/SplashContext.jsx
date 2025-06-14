import React, { createContext, useContext, useState, useEffect } from 'react'
import { userService } from '../services/user.service'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SplashContext = createContext()

export const SplashProvider = ({ children }) => {
    const [splash, setSplash] = useState(async () => {
        const phrases = await AsyncStorage.getItem("phrases")
        const fixedParameters = await AsyncStorage.getItem("fixedParameters")
        const calculators = await AsyncStorage.getItem("calculators")

        return {
            phrases: phrases ? JSON.parse(phrases) : null,
            fixedParameters: fixedParameters ? JSON.parse(fixedParameters) : null,
            calculators: calculators ? JSON.parse(calculators) : null
        }
    })

    const [forceFetchSplash, setForceFetchSplash] = useState(false)

    useEffect(() => {
        async function fetchSplashIfNeeded() {
            if (forceFetchSplash || !splash || !splash.phrases || !splash.fixedParameters || !splash.calculators) {
                fetchSplash()
            } else {
                await AsyncStorage.setItem("phrases", JSON.stringify(splash.phrases))
                await AsyncStorage.setItem("fixedParameters", JSON.stringify(splash.fixedParameters))
                await AsyncStorage.setItem("calculators", JSON.stringify(splash.calculators))
            }
        }

        fetchSplashIfNeeded()
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
