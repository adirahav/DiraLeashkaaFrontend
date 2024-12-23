import React, { useEffect, useRef, useState } from 'react'
import { utilService } from '../services/util.service'
import iconLock from '../assets/images/icon_lock.svg'
import { useSplash } from '../contexts/SplashContext'

export function CalculatorsCalculator({ index, calculator, onCalculatorPress }) {   
    const { splash } = useSplash()
    const phrases = splash?.phrases

    const handleCalculatorPress = (ev, calculator) => {
        if (!calculator || calculator.isLock || calculator.isComingSoon) {
            ev.preventDefault()
            ev.stopPropagation()
            return
        }

        onCalculatorPress(ev, calculator)
    }

    const articleClass = (!calculator
                            ? `loading${index}`
                            : '')
                       + (calculator?.isLock
                                ? ` lock`
                                : '')
                      

    return (
        <article className={articleClass} onClick={(ev) => handleCalculatorPress(ev, calculator)}>
            {calculator?.isLock && <img src={iconLock} />}
            <h2>{utilService.getPhrase(`calculator_title_${utilService.toSnakeCase(calculator?.type)}`, phrases)}</h2>
            {calculator?.isComingSoon && <span>{utilService.getPhrase("calculator_coming_soon", phrases)}</span>}
        </article>
    )
}
