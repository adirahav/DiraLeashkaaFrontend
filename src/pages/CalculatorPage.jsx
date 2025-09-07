import { useEffect, useState } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { useSplash } from '../contexts/SplashContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { CalculatorMaxPrice } from '../cmps/CalculatorMaxPrice'
import { CalculatorCompare } from '../cmps/CalculatorCompare'
import { onLoadingDone, onLoadingStart } from '../store/actions/app.actions'
import { utilService } from '../services/util.service'

export function CalculatorPage() {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    let calculatorId = queryParams.get('calculatorId')
    
    const navigate = useNavigate()

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters
    const calculators = splash?.calculators
    
    const [type, setType] = useState()

    useEffect(() => {
        if (!phrases || !fixedParameters || !calculators) {
            onLoadingStart()  
        } else {
            const calculator = calculators?.find(calculator => calculator._id === calculatorId)
            if (!calculator) {
                navigate("/home") 
            }
            setType(calculator?.type) 
            onLoadingDone()  
        }
    }, [phrases, fixedParameters, calculators, calculatorId, navigate])

    const mainClass = `calculator ${utilService.toKebabCase(type)}`

    return (<>
        <Header />
        <main className={mainClass}>
            {type === "maxPrice" && <CalculatorMaxPrice />}
            {type === "compare" && <CalculatorCompare />}
        </main>
        <Footer />
    </>)
}
