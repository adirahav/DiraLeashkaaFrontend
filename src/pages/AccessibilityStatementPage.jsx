import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { utilService } from '../services/util.service'
import { useSplash } from '../contexts/SplashContext'
import { useNativeBackButton } from '../hooks/useNativeBackButton'
import { useEffect, useState } from 'react'
import { FormField } from '../cmps/FormField'
import { useSelector } from 'react-redux'
import { onToggleAccessibilityPanel } from '../store/actions/app.actions'

export function AccessibilityStatementPage() {

    const { splash } = useSplash()
    const phrases = splash?.phrases
    
    const showAccessibilityPanelState = useSelector(storeState => storeState.appModule.accessibility.showAccessibilityPanel)

    const [accessibilityPanelToggle, setAccessibilityPanelToggle] = useState({
        checked: showAccessibilityPanelState,
        onLabel: utilService.getPhrase(`user_accessibility_statement_show_panel_text`, phrases),
        offLabel: utilService.getPhrase(`user_accessibility_statement_hide_panel_text`, phrases),
    })

    useEffect(() => {
        setAccessibilityPanelToggle(prevAccessibilityPanelToggle => ({ 
            ...prevAccessibilityPanelToggle, 
            checked: showAccessibilityPanelState
        }))

    }, [showAccessibilityPanelState])

    useNativeBackButton((superBack) => {
        const referrer = document.referrer

        if (referrer) {
            superBack()
        }
    })

    return (<>
        <Header />
        <main className="accessibility-statement container">
            <div dangerouslySetInnerHTML={{ __html: utilService.getPhrase(`user_accessibility_statement_text`, phrases) }}></div>
            <hr />
            <FormField type={"TOGGLE"} params={accessibilityPanelToggle} onChange={(checked) => onToggleAccessibilityPanel(checked)} />
        </main>
        <Footer />

        
    </>)
}
