import { useEffect, useState, useRef, useCallback } from "react"
import { eventBusService } from "../services/eventBus.service"
import { AccessibilitIcon} from '../assets/icons'
import { FormField } from "./FormField"
import { utilService } from "../services/util.service"
import { useSplash } from "../contexts/SplashContext"

export function AccessibilityPanel() {

    return (
        <section className="accessibility-panel">
            <AccessibilitIcon />
        </section>
    )
}

