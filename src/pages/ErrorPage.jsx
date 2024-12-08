import { useState, useEffect, useCallback } from 'react'
import { Navigate, NavLink, useNavigate } from 'react-router-dom'
import { hideDialog, showNoInternetDialog } from '../cmps/Dialog'
import { utilService } from '../services/util.service'
import { useInternetStatus } from '../hooks/useInternetStatus'
import { useSplash } from '../contexts/SplashContext'


export function ErrorPage() {
    const params = new URLSearchParams(window.location.search)
    const errorType = params.get('errorType')
    const redirect = params.get('redirect')

    const navigate = useNavigate()
    
    const { splash } = useSplash()
    const phrases = splash?.phrases

    useEffect(() => {
        if (errorType === "noInternet") {
            setTimeout(() => {
                showNoInternetDialog({
                    title: "title",
                    message: "message",
                    closeButton: { show: true, autoClose: false }, 
                    positiveButton: { show: true, text: utilService.getPhrase("dialog_no_internet_positive", phrases), onPress: () => handleCheckConnection(), closeAfterPress: false }, 
                    negativeButton: { show: false }, 
                })
            }, 0)
        }
    }, [])

    useInternetStatus((isConnected) => {
        if (isConnected && errorType === "noInternet" && redirect) {
            setTimeout(() => {
                hideDialog()
                navigate(redirect)
            }, 0)
        }
    }, [])

    const handleCheckConnection = async () => {
        const URL = "https://httpbin.org/status/200"
        const response = await fetch(URL, { method: "HEAD", cache: "no-store" })
        if (response.ok) {
            setTimeout(() => {
                hideDialog()
                navigate(redirect)
            }, 0)
        }
    }

    return (
        <></>
    )
}
