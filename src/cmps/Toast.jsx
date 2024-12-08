import { useEffect, useState, useRef } from "react"
import { eventBusService } from "../services/eventBus.service"
import { Button } from "@mui/material"

window.showDebugToast = showDebugToast
window.showNotifyToast = showNotifyToast
window.showWarningToast = showWarningToast
window.showErrorToast = showErrorToast

/*showErrorToast({
    message: "ארעה שגיאה",
    undoButton: { show: true, text: "undo", onPress: async () => { alert("undo") } }
})*/
export function Toast() {

    const [displayToast, setDisplayToast] = useState(false)    
    const [type, setType] = useState('message')    // debug | notify | warning | error
    const [message, setMessage] = useState('')
    const [undoButton, setUndoButton] = useState({show: true, onPress: null})
    const [stage, setStage] = useState(null)
    
    const toastRef = useRef()

    useEffect(() => {
        const unsubscribe = eventBusService.on('show-toast', (data) => {
            setType(data.type ?? type)
            setMessage(data.message)
            setUndoButton({ ...undoButton, ...data.undoButton })
            setDisplayToast(true)
            setStage('opening')

            setTimeout(() => {
                setStage('')
            }, 1500)

            setTimeout(() => {
                setStage('closing')
            }, 3500) 
            
            setTimeout(() => {
                onClose()
            }, 5000)
        })

        return unsubscribe
    }, [type, message, undoButton])

    function onClose() {
        setType(null)
        setMessage(null)
        setUndoButton(null)
        setDisplayToast(false)
    }

    function handleUndo() {
        if (undoButton.onPress) {
            undoButton.onPress()
        }
    }

    if (!displayToast) return <></>

    const divClass = `toast ${type} ${stage}`

    return (
        <div ref={toastRef} className={divClass}>
            <section className="message">
                <p dangerouslySetInnerHTML={{ __html: message }}></p>{undoButton.show && <u onClick={handleUndo}>בטל</u>}
            </section>
        </div>
    )
}

function showToast(data) {
    eventBusService.emit('show-toast', data)
}

export function showDebugToast(data) {
    showToast({ ...data, type: 'debug' })
}

export function showNotifyToast(data) {
    showToast({ ...data, type: 'notify' })
}

export function showWarningToast(data) {
    showToast({ ...data, type: 'warning' })
}

export function showErrorToast(data) {
    showToast({ ...data, type: 'error' })
}