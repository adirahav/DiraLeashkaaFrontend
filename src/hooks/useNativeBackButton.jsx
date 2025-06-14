import { useEffect } from 'react'
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

export function useNativeBackButton(handler) {
  console.log("ADITEST useNativeBackButton")
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') return

    let removeListener

    const setupListener = async () => {
      console.log("ADITEST: useNativeBackButton - Add BackButton listener")
      const listener = await App.addListener('hardwareBackPress', handler)
      removeListener = listener.remove
    }

    setupListener()

    return () => {
      if (removeListener) {
        console.log("ADITEST: useNativeBackButton - Remove BackButton listener")
        removeListener()
      }
    }
  }, [handler])
}
