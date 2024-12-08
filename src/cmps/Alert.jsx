import { useEffect, useState, useRef } from "react"
import { eventBusService } from "../services/eventBus.service"
import { Button } from "@mui/material"
import { IconSizes, SuccessIcon, ErrorIcon, WarningIcon, MessageIcon, CloseIcon, TooltipIcon} from '../assets/icons'

window.showSuccessAlert = showSuccessAlert
window.showWarningAlert = showWarningAlert
window.showErrorAlert = showErrorAlert
window.showTooltipAlert = showTooltipAlert

export function Alert() {

    const [displayAlert, setDisplayAlert] = useState(false)    
    const [type, setType] = useState('message')    // error | warning | success | message | tooltip
    const [message, setMessage] = useState('')
    const [positiveButton, setPositiveButton] = useState({show: true, text: "", onPress: null, closeAfterPress: true})
    const [negativeButton, setNegativeButton] = useState({show: true, text: "", onPress: null, closeAfterPress: true})
    const [closeButton, setCloseButton] = useState({show: true, autoClose: true, autoCloseSeconds: 3})
    const alertRef = useRef()

    useEffect(() => {
        const unsubscribe = eventBusService.on('show-alert', (data) => {
            setType(data.type ?? type)
            setMessage(data.message)
            setPositiveButton({ ...positiveButton, ...data.positiveButton })
            setNegativeButton({ ...negativeButton, ...data.negativeButton })
            
            setCloseButton((prevCloseButton) => {
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

    useEffect(() => {
        if (type || message || positiveButton || negativeButton || closeButton) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)
            }, 0)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [type, message, positiveButton, negativeButton, closeButton])


    function handleClickOutside(ev) {
        if (alertRef.current && !alertRef.current.contains(ev.target)) {
            onClose()
        }
    }

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
            case "error":     return <><div><ErrorIcon sx={ IconSizes.Medium } /><h2>שגיאה</h2></div></>
            case "warning":   return <><div><WarningIcon sx={ IconSizes.Medium } /><h2>אזהרה</h2></div></>
            case "success":   return <><div><SuccessIcon sx={ IconSizes.Medium } /><h2>הצלחה</h2></div></>
            case "message":   return <><div><MessageIcon sx={ IconSizes.Medium } /><h2>הודעה</h2></div></>
            case "tooltip":   return <><div><TooltipIcon sx={ IconSizes.Medium } /><h2>הסבר</h2></div></>
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
                {positiveButton.show && <Button variant="contained" className='positive' onClick={() => handleButton(positiveButton)}>{positiveButton.text}</Button>}
                {negativeButton.show && <Button variant="contained" className='negative' onClick={() => handleButton(negativeButton)}>{negativeButton.text}</Button>}
            </section>
        </div>
    )
}

function showAlert(data) {
    eventBusService.emit('show-alert', data)
}

export function showErrorAlert(data) {
    showAlert({ ...data, type: 'error' })
}

export function showWarningAlert(data) {
    showAlert({ ...data, type: 'warning' })
}

export function showSuccessAlert(data) {
    showAlert({ ...data, type: 'success' })
}

export function showMessageAlert(data) {
    showAlert({ ...data, type: 'message' })
}

export function showTooltipAlert(data) {
    showAlert({ ...data, type: 'tooltip' })
}