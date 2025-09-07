import { useEffect, useState, useRef, useCallback } from "react"
import { eventBusService } from "../services/eventBus.service"
import { IconSizes, SuccessIcon, ErrorIcon, WarningIcon, MessageIcon, CloseIcon, TooltipIcon} from '../assets/icons'
import { FormField } from "./FormField"
import { utilService } from "../services/util.service"
import { useSplash } from "../contexts/SplashContext"

export function Alert() {

    const [displayAlert, setDisplayAlert] = useState(false)    
    const [type, setType] = useState('message')    // error | warning | success | message | tooltip
    const [message, setMessage] = useState('')
    const [positiveButton, setPositiveButton] = useState({show: true, text: "", onPress: null, closeAfterPress: true})
    const [negativeButton, setNegativeButton] = useState({show: true, text: "", onPress: null, closeAfterPress: true})
    const [closeButton, setCloseButton] = useState({show: true, autoClose: true, autoCloseSeconds: 3})
    const alertRef = useRef()

    const { splash } = useSplash()
    const phrases = splash?.phrases

    useEffect(() => {
        const unsubscribe = eventBusService.on('show-alert', (data) => {
            setType(data.type ?? type)
            setMessage(data.message)
            setPositiveButton(prevPositiveButton => ({ ...prevPositiveButton, ...data.positiveButton }))
            setNegativeButton(prevNegativeButton => ({ ...prevNegativeButton, ...data.negativeButton }))
            
            setCloseButton(() => {
                const _closeButton = { ...closeButton, ...data.closeButton }
                
                if (_closeButton && _closeButton.autoClose) {
                    setTimeout(() => {
                        onClose()
                    }, _closeButton.autoCloseSeconds * 1000)
                }
    
                return _closeButton
            }) 

            setDisplayAlert(true)
        })

        return unsubscribe
    }, [type, message, positiveButton, negativeButton, closeButton])

    const handleClickOutside = useCallback((ev) => {
        if (alertRef.current && !alertRef.current.contains(ev.target)) {
            onClose()
        }
    }, [])

    useEffect(() => {
        if (type || message || positiveButton || negativeButton || closeButton) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)
            }, 0)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [type, message, positiveButton, negativeButton, closeButton, handleClickOutside])


    function onClose() {
        setType(null)
        setMessage(null)
        setPositiveButton(null)
        setNegativeButton(null)
        setCloseButton(null)
        setDisplayAlert(false)
    }

    function handleButton(button) {
        if (button === null) {
            return
        }

        if (button.onPress !== null) {
            button.onPress()
        }
        
        if (button.closeAfterPress) {
            onClose()
        }
    }

    if (!displayAlert) return <></>

    function getHeader() {  
        switch (type) {
            case "error":     return <><div><ErrorIcon sx={ IconSizes.Medium } /><h2>{utilService.getPhrase("alert_title_error", phrases)}</h2></div></>
            case "warning":   return <><div><WarningIcon sx={ IconSizes.Medium } /><h2>{utilService.getPhrase("alert_title_warning", phrases)}</h2></div></>
            case "success":   return <><div><SuccessIcon sx={ IconSizes.Medium } /><h2>{utilService.getPhrase("alert_title_success", phrases)}</h2></div></>
            case "message":   return <><div><MessageIcon sx={ IconSizes.Medium } /><h2>{utilService.getPhrase("alert_title_message", phrases)}</h2></div></>
            case "tooltip":   return <><div><TooltipIcon sx={ IconSizes.Medium } /><h2>{utilService.getPhrase("alert_title_tooltip", phrases)}</h2></div></>
            default: <></>
        }
    }

    
    return (
        <div ref={alertRef} className={"alert " + type}>
            <header>
                {getHeader()}
                {closeButton.show && <CloseIcon sx={ IconSizes.Small } onClick={onClose} />}
            </header>
            <section className="message">
                <p dangerouslySetInnerHTML={{ __html: message }}></p>
            </section>
            <section className="buttons">
                {positiveButton.show && <FormField type={"BUTTON_LONG"} params={positiveButton} onPress={() => handleButton(positiveButton)} />}
                {negativeButton.show && <FormField type={"BUTTON_LONG"} params={negativeButton} onPress={() => handleButton(negativeButton)} />}
            </section>
        </div>
    )
}

function showAlert(data) {
    eventBusService.emit('show-alert', data)
}

export const showErrorAlert   = (data) => showAlert({ ...data, type: "error" })
export const showWarningAlert = (data) => showAlert({ ...data, type: "warning" })
export const showSuccessAlert = (data) => showAlert({ ...data, type: "success" })
export const showMessageAlert = (data) => showAlert({ ...data, type: "message" })
export const showTooltipAlert = (data) => showAlert({ ...data, type: "tooltip" })

window.showSuccessAlert = showSuccessAlert
window.showWarningAlert = showWarningAlert
window.showErrorAlert = showErrorAlert
window.showTooltipAlert = showTooltipAlert