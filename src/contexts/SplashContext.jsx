import { createContext, useContext, useState, useEffect } from 'react'
import { userService } from '../services/user.service'
import { utilService } from '../services/util.service.js'
import PropTypes from 'prop-types'

const SplashContext = createContext()

export const SplashProvider = ({ children }) => {
    const [splash, setSplash] = useState(null)
    const [forceFetchSplash, setForceFetchSplash] = useState(false)

    useEffect(() => {
        const loadSplashFromStorage = async () => {
            const phrases = await utilService.getFromStorage("phrases")
            const fixedParameters = await utilService.getFromStorage("fixedParameters")
            //const calculators = await utilService.getFromStorage("calculators")

            setSplash({
                phrases: phrases ? JSON.parse(phrases) : null,
                fixedParameters: fixedParameters ? JSON.parse(fixedParameters) : null,
                //calculators: calculators ? JSON.parse(calculators) : null,
            })
        }

        loadSplashFromStorage()
    }, [])

    useEffect(() => {
        if (forceFetchSplash || !splash || !splash.phrases || !splash.fixedParameters/* || !splash.calculators*/) {
            fetchSplash()
        } else {
            utilService.saveToStorage("phrases", JSON.stringify(splash.phrases))
            utilService.saveToStorage("fixedParameters", JSON.stringify(splash.fixedParameters))
            //utilService.saveToStorage("calculators", JSON.stringify(splash.calculators))
        }
    }, [splash, forceFetchSplash])

    const fetchSplash = async () => {
        try {
            const splashData = await userService.splash()
            setSplash({
                phrases: splashData.phrases,
                fixedParameters: splashData.fixedParameters,
                //calculators: splashData.calculators
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

SplashProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
