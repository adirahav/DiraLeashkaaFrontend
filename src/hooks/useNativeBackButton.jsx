import { useEffect } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

export function useNativeBackButton(handler) {
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') return

    const listener = CapacitorApp.addListener('backButton', handler)

    return () => {
      listener.then(l => l.remove())
    }
  }, [handler])
}
