import { useEffect, useState, useRef, useCallback } from "react"
import { eventBusService } from "../services/eventBus.service"
import { AccessibilitIcon, CloseIcon, IconSizes} from '../assets/icons'
import { FormField } from "./FormField"
import { utilService } from "../services/util.service"
import { useSplash } from "../contexts/SplashContext"
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { onChangeFontSize } from "../store/actions/app.actions"

export function AccessibilityPanel() {

    const { splash } = useSplash()
    const phrases = splash?.phrases
    
    const handleOpenAccessibilityModal = () => {
        showAccessibilityModal({
            positiveButton: { text: utilService.getPhrase("accessibility_button_close", phrases) }, 
        })
    }

    return (<>
        <button className="accessibility-panel" onClick={handleOpenAccessibilityModal}>
            <AccessibilitIcon />
        </button>
        <AccessibilityModal />
    </>)
}

export function AccessibilityModal() {

    const [displayAccessibilityModal, setDisplayAccessibilityModal] = useState(false)    
    const [positiveButton, setPositiveButton] = useState({text: ""})
    
    const accessibilityModalRef = useRef()

    const { splash } = useSplash()
    const phrases = splash?.phrases

    const BASE_FONT = 16
    const MIN_FONT = 14
    const MAX_FONT = 32
    //const FONT_MARKS = [14, 16, 20, 24, 28, 32]
    const [fontSize, setFontSize] = useState(BASE_FONT)
    
    useEffect(() => {
        const unsubscribe = eventBusService.on('show-accessibility-modal', (data) => {
            setPositiveButton(prevPositiveButton => ({ ...prevPositiveButton, ...data.positiveButton }))
            setDisplayAccessibilityModal(true)
        })

        return unsubscribe
    }, [positiveButton])

    const handleClickOutside = useCallback((ev) => {
        if (accessibilityModalRef.current && !accessibilityModalRef.current.contains(ev.target)) {
            onClose()
        }
    }, [])

    useEffect(() => {
        if (positiveButton) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)
            }, 0)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [positiveButton, handleClickOutside])


    function onClose() {
        setPositiveButton(null)
        setDisplayAccessibilityModal(false)
    }

    function handleButton(button) {
        if (button === null) {
            return
        }

        if (button.onPress !== null) {
            button.onPress()
        }
    }

    if (!displayAccessibilityModal) return <></>

    return (
        <div ref={accessibilityModalRef} className="accessibility-modal">
            <header>
                <div><AccessibilitIcon sx={ IconSizes.Medium } /><h2>{utilService.getPhrase("accessibility_title", phrases)}</h2></div>
                <CloseIcon sx={ IconSizes.Small } onClick={onClose} />
            </header>
            <section className="font-size">
                <div style={{ padding: "2rem" }}>
                    <label htmlFor="font-slider" style={{ display: "block", marginBottom: "1rem" }}>
                        גודל טקסט: {fontSize}px
                    </label>
                    <Slider
                        id="font-slider"
                        className="slider"
                        value={fontSize}
                        min={MIN_FONT}
                        max={MAX_FONT}
                        step={1.6} 
                        onChange={(value) => onChangeFontSize(value)}
                    />
                    <p style={{ fontSize: `${fontSize}px`, marginTop: "2rem" }}>
                        זה טקסט לדוגמה שמציג את גודל הפונט שבחרת
                    </p>
                </div>
            </section>
            <section className="buttons">
                <FormField type={"BUTTON_LONG"} params={positiveButton} onPress={onClose} />
            </section>
        </div>
    )
}

export const showAccessibilityModal = (data) => {
    eventBusService.emit('show-accessibility-modal', data)
}

window.showAccessibilityModal = showAccessibilityModal