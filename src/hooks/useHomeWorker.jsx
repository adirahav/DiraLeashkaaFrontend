import { useEffect, useRef } from 'react'
import { saveHome } from '../store/actions/user.actions'

export function useHomeWorker(enabled = true) {
    const workerRef = useRef(null)

    useEffect(() => {
        if (!enabled) {
            return
        }

        const newWorker = new Worker(
            new URL('../workers/home.worker.js', import.meta.url), 
            { type: 'module' }
        )

        workerRef.current = newWorker

        newWorker.onmessage = (event) => {
            if (event.data.type === 'fullData') {
                saveHome(event.data.data)
            } else if (event.data.type === 'error') {
                console.error('Worker error:', event.data.error)
            }
        }

        return () => {
            newWorker.terminate()
        }
    }, [enabled])

    const postMessage = (data) => {
        if (workerRef.current) {
            workerRef.current.postMessage(data)
        }
    }

    return { postMessage }
}
