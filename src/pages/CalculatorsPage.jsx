import { useEffect } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { useSplash } from '../contexts/SplashContext'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CalculatorsCalculator } from '../cmps/CalculatorsCalculator'
import { onLoadingDone, onLoadingStart } from '../store/actions/app.actions'
import { utilService } from '../services/util.service'

export function CalculatorsPage() {

    const LOADING_CALCULATORS_COUNT = 4
    
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const navigate = useNavigate()

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters
    const calculators = splash?.calculators

    useEffect(() => {
        if (!phrases || !fixedParameters || !calculators) {
            onLoadingStart()  
        } else {
            onLoadingDone()  
        }

    }, [phrases, fixedParameters, calculators])

    function onCalculatorPress(ev, calculator) {
        navigate(`/calculator?calculatorId=${calculator._id}`)
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
