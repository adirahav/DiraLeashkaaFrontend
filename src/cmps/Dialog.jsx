import { useEffect, useState, useRef } from "react"
import { eventBusService } from "../services/eventBus.service"
import { Button } from "@mui/material"
import { utilService } from "../services/util.service"
import { useSplash } from "../contexts/SplashContext"

window.showNoInternetDialog = showNoInternetDialog

export function Dialog() {

    const [displayDialog, setDisplayDialog] = useState(false)    
    const [type, setType] = useState(null)    // no_internet | 
    const [message, setMessage] = useState('')
    const [positiveButton, setPositiveButton] = useState({show: true, text: "", onPress: null, closeAfterPress: true})
    const [negativeButton, setNegativeButton] = useState({show: true, text: "", onPress: null, closeAfterPress: true})
    const dialogRef = useRef()

    const { splash } = useSplash()
    const phrases = splash?.phrases

    useEffect(() => {
        const unsubscribeShow = eventBusService.on('show-dialog', (data) => {
            setType(data.type ?? type)
            setMessage(data.message)
            setPositiveButton(prevPositiveButton => ({ ...prevPositiveButton, ...data.positiveButton }))
            setNegativeButton(prevNegativeButton => ({ ...prevNegativeButton, ...data.negativeButton }))   
            setDisplayDialog(true)
        })

        const unsubscribeHide = eventBusService.on('hide-dialog', () => {
            onClose() 
        })

        return () => {
            unsubscribeShow()
            unsubscribeHide()
        }
    }, [type, message, positiveButton, negativeButton])

    useEffect(() => {
        if (type || message || positiveButton || negativeButton) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)
            }, 0)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [type, message, positiveButton, negativeButton])


    function handleClickOutside(ev) {
        if (dialogRef.current && !dialogRef.current.contains(ev.target)) {

            if (type !== "no_internet") {
                onClose()
            }
        }
    }

    function onClose() {
        setType(null)
        setMessage(null)
        setPositiveButton(null)
        setNegativeButton(null)
        setDisplayDialog(false)
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

    const imageAnimation = `../src/assets/images/anim_dialog_${type}.gif`
    if (!displayDialog) return <></>

    return (
        <div ref={dialogRef} className={"dialog " + type}>
            <section className="image">
                <img src={imageAnimation} alt='' />
            </section>
            <section className="message">
                <h2>{utilService.getPhrase(`dialog_${type}_title`, phrases)}</h2>
                <p dangerouslySetInnerHTML={{ __html: utilService.getPhrase(`dialog_${type}_message`, phrases) }}></p>
            </section>
            <section className="buttons">
                {positiveButton.show && <Button variant="contained" className='positive' onClick={() => handleButton(positiveButton)}>{positiveButton.text}</Button>}
                {negativeButton.show && <Button variant="contained" className='negative' onClick={() => handleButton(negativeButton)}>{negativeButton.text}</Button>}
            </section>
        </div>
    )
}

function showDialog(data) {
    eventBusService.emit('show-dialog', data)
}

export function showNoInternetDialog(data) {
    showDialog({ ...data, type: 'no_internet' })
}

export function hideDialog() {
    eventBusService.emit('hide-dialog')
}