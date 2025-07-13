import { useEffect, useRef } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { useNavigate, useLocation } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'

export function NativeBackHandler() {
  const navigate = useNavigate()
  const location = useLocation()
  const locationRef = useRef(location)

  // Keep ref updated with the latest location
  useEffect(() => {
    locationRef.current = location
  }, [location])

  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') return
    console.log("ADITEST Back button addListener")

    const backListener = CapacitorApp.addListener('backButton', () => {
      const path = locationRef.current.pathname
      console.log(`ADITEST Back button pressed. Current path: ${path}`)

      if (path === '/property') {
        alert('ADITEST Custom back handler on PropertyPage!')
        return
      }

      if (window.history.state?.idx > 0) {
        navigate(-1)
      } else {
        CapacitorApp.exitApp()
      }
    })

    return () => {
      backListener.remove()
    }
  }, [navigate])

  return null
}