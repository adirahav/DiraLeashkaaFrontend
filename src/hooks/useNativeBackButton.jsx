import { useEffect } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

let backHandlers = []
let isListenerAttached = false

export function useNativeBackButton(userHandler) {
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') return

    const previousHandler = backHandlers[backHandlers.length - 1]
    const superBack = () => {
      if (previousHandler) previousHandler()
    }

    const wrappedHandler = () => {
      userHandler(superBack)
    }

    backHandlers.push(wrappedHandler)

    if (!isListenerAttached) {
      CapacitorApp.addListener('backButton', () => {
        const top = backHandlers[backHandlers.length - 1]
        if (top) top()
      })
      isListenerAttached = true
    }

    return () => {
      backHandlers = backHandlers.filter(fn => fn !== wrappedHandler)
    }
  }, [userHandler])
}
