import { useEffect, useState } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { useSplash } from '../contexts/SplashContext'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CalculatorsCalculator } from '../cmps/CalculatorsCalculator'
import { onLoadingDone, onLoadingStart } from '../store/actions/app.actions'
import { utilService } from '../services/util.service'
import { calculatorService } from '../services/calculator.service'

export function CalculatorsPage() {

    const LOADING_CALCULATORS_COUNT = 4
    
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const navigate = useNavigate()

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    const [calculators, setCalculators] = useState()
    
    useEffect(() => {
        if (!phrases || !fixedParameters) {
            onLoadingStart()  
        } else {
            fetchCalculators() 
        }

    }, [phrases, fixedParameters])

    const fetchCalculators = async () => {
        try {
            onLoadingStart() 
            //setShowOverlay(true)

            const fetchInitialData = async () => {
                const allCalculators = await calculatorService.getCalculators()
                setCalculators(allCalculators)
                onLoadingDone() 
            }

            fetchInitialData()
        } catch (error) {
            console.error(`Error fetching calculators:`, error)
            //setShowOverlay(false)
            onLoadingDone() 
        } 
    }
    
    function onCalculatorPress(ev, calculator) {
        navigate(`/calculator?calculatorUUID=${calculator.uuid}`)
    }

    const titleClass = isLoadingState ? 'loading0' : '' 

    return (<>
        <Header />
        <main className="calculators narrow container">
            <h1 className={titleClass}>{utilService.getPhrase(`calculators_title`, phrases)}</h1>
            <section>
                {!isLoadingState && calculators?.map((calculator, index) => (    
                    <CalculatorsCalculator key={index} calculator={calculator} onCalculatorPress={onCalculatorPress} />
                ))}
                {isLoadingState && 
                    <>
                        {[...Array(LOADING_CALCULATORS_COUNT)].map((_, index) => (
                            <CalculatorsCalculator key={index} index={index} />
                        ))}
                    </>
                }
            </section>
        </main>
        <Footer />
    </>)
}
