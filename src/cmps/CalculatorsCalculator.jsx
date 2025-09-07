import { useEffect, useState } from 'react'
import { utilService } from '../services/util.service'
import iconLock from '../assets/images/icon_lock.svg'
import { useSplash } from '../contexts/SplashContext'
import { FormField } from './FormField'
import PropTypes from "prop-types"

export function CalculatorsCalculator({ index, calculator, onCalculatorPress }) {   
    const { splash } = useSplash()
    const phrases = splash?.phrases

    const [calculatorIcon, setCalculatorIcon] = useState(null)
    
    const enterButton = {
            text: utilService.getPhrase("calculator_calculate_button", phrases), 
            isDisabled: false,
            isLoading: false
        }

    useEffect(() => {
        (async () => {
            const iconPath = await getCalculatorIcon(calculator)
            setCalculatorIcon(iconPath)
        })()
    }, [calculator])

    const handleCalculatorPress = (ev, calculator) => {
        if (!calculator || calculator.isLock || calculator.isComingSoon) {
            ev.preventDefault()
            ev.stopPropagation()
            return
        }

        onCalculatorPress(ev, calculator)
    }

    const getCalculatorIcon = async (calculator) => {
        try {console.log(`icon_calculator_${utilService.toSnakeCase(calculator?.type)}`)
            const module = await import(`../assets/images/icon_calculator_${utilService.toSnakeCase(calculator?.type)}.png`)
            return module.default
        } catch (error) {
            const module = await import(`../assets/images/icon_calculator_missing.png`)
            return module.default
        }
    }

    const articleClass = (!calculator
                            ? `loading${index}`
                            : '')
                       + (calculator?.isLock
                                ? ` lock`
                                : '')
                      
                        
    return (
        <article className={articleClass}>
            <img src={calculatorIcon} alt='' />
            <div>
                <h2>{utilService.getPhrase(`calculator_title_${utilService.toSnakeCase(calculator?.type)}`, phrases)}</h2>
                <span>{utilService.getPhrase(`calculator_desc_${utilService.toSnakeCase(calculator?.type)}`, phrases)}</span>
            </div>
            <div>
                {!calculator?.isLock && !calculator?.isComingSoon && <FormField type={"BUTTON_LONG"} params={enterButton} onPress={(ev) =>  handleCalculatorPress(ev, calculator)} />}
                {calculator?.isLock && !calculator?.isComingSoon && <img src={iconLock} alt='נעול - בקרוב' />}
                {calculator?.isComingSoon && <span>{utilService.getPhrase("calculator_coming_soon", phrases)}</span>}
            </div>
            
        </article>
    )
}

CalculatorsCalculator.propTypes = {
    index: PropTypes.number,
    calculator: PropTypes.shape({
      isLock: PropTypes.bool,
      isComingSoon: PropTypes.bool,
      type: PropTypes.string,
    }),
    onCalculatorPress: PropTypes.func,
    setEnterButton: PropTypes.func,
}
