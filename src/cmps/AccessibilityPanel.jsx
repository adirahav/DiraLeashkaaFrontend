import { useEffect, useState, useRef, useCallback } from "react"
import { eventBusService } from "../services/eventBus.service"
import { AccessibilitIcon, CloseIcon, IconSizes} from '../assets/icons'
import { FormField } from "./FormField"
import { utilService } from "../services/util.service"
import { useSplash } from "../contexts/SplashContext"
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { onChangeFontSize } from "../store/actions/app.actions"
import { useSelector } from "react-redux"

export function AccessibilityPanel() {

    const { splash } = useSplash()
    const phrases = splash?.phrases
    
    const handleOpenAccessibilityModal = () => {
        showAccessibilityModal({
            positiveButton: { text: utilService.getPhrase("accessibility_button_save", phrases) }, 
            negativeButton: { text: utilService.getPhrase("accessibility_button_close", phrases) }, 
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
    const [negativeButton, setNegativeButton] = useState({text: ""})

    const accessibilityModalRef = useRef()

    const { splash } = useSplash()
    const phrases = splash?.phrases

    const BASE_FONT = 16
    const MIN_FONT = 14
    const MAX_FONT = 32
    
    const customeFontSizeState = useSelector(storeState => storeState.appModule.accessibility.customeFontSize)

    useEffect(() => {
        const unsubscribe = eventBusService.on('show-accessibility-modal', (data) => {
            setPositiveButton(prevPositiveButton => ({ ...prevPositiveButton, ...data.positiveButton }))
            setNegativeButton(prevNegativeButton => ({ ...prevNegativeButton, ...data.negativeButton }))
            setDisplayAccessibilityModal(true)
        })

        return unsubscribe
    }, [positiveButton, negativeButton])

    const handleClickOutside = useCallback((ev) => {
        if (accessibilityModalRef.current && !accessibilityModalRef.current.contains(ev.target)) {
            onClose()
        }
    }, [])

    useEffect(() => {
        if (positiveButton && negativeButton) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)
            }, 0)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [positiveButton, negativeButton, handleClickOutside])


    function onClose() {
       console.log("")//
        setPositiveButton(null)
        setNegativeButton(null)
        setDisplayAccessibilityModal(false)
    }

    function onSave() {
        onClose()
    }

    function onReset() {
        onChangeFontSize(BASE_FONT)
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
                <div>
                    <div className="header">
                        <label htmlFor="font-slider">
                            { utilService.getPhrase("accessibility_font_size", phrases).replace("%1$s", 100 * (customeFontSizeState / 16)) }
                        </label>
                        <a onClick={onReset}>{ utilService.getPhrase("accessibility_button_reset", phrases) }</a>
                    </div>
                    <Slider
                        id="font-slider"
                        className="slider"
                        value={customeFontSizeState}
                        min={MIN_FONT}
                        max={MAX_FONT}
                        step={2} 
                        onChange={(value) => onChangeFontSize(value)}
                    />
                </div>
            </section>
            <section className="buttons">
                <FormField type={"BUTTON_LONG"} params={positiveButton} onPress={onSave} />
                <FormField type={"BUTTON_LONG"} params={negativeButton} onPress={onClose} />
            </section>
        </div>
    )
}

export const showAccessibilityModal = (data) => {
    eventBusService.emit('show-accessibility-modal', data)
}

window.showAccessibilityModal = showAccessibilityModal