import React from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { useSplash } from '../contexts/SplashContext'

export function CalculatorsPage() {

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const calculators = splash?.calculators
    
    return (<>
        <Header />
        <main className="calculators container">
            <p>
                calculators
            </p>
        </main>
        <Footer />
    </>)
}
