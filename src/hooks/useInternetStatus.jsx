import { useState, useEffect } from "react"

export function useInternetStatus(callback, dependencies = []) {
    const [isConnected, setIsConnected] = useState(navigator.onLine)
  
    const URL = "https://httpbin.org/status/200"
    const INTERVAL = 10 * 1000

    const updateInternetStatus = (_isConnected) => {
        setIsConnected(_isConnected)
        if (callback) callback(_isConnected)
    }

    useEffect(() => {
        
        const updateOnlineStatus = () => updateInternetStatus(navigator.onLine)

        const checkConnection = async () => {
            if (navigator.onLine) {
                try {
                    const response = await fetch(URL, { method: "HEAD", cache: "no-store" })
                    updateInternetStatus(response.ok)
                } catch (error) {
                    updateInternetStatus(false)
                }
            } else {
                updateInternetStatus(false)
            }
        }

        window.addEventListener("online", updateOnlineStatus)
        window.addEventListener("offline", updateOnlineStatus)

        checkConnection()
        const timer = setInterval(checkConnection, INTERVAL)

        return () => {
            window.removeEventListener("online", updateOnlineStatus)
            window.removeEventListener("offline", updateOnlineStatus)
            clearInterval(timer)
        }
    }, [callback, dependencies])

    return isConnected
}
