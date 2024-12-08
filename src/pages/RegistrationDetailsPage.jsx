import React from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { useSplash } from '../SplashContext'

export function RegistrationDetailsPage() {

    const { splash } = useSplash()
    const phrases = splash?.phrases

    return (<>
        <Header />
        <main className="registration-details container">
            <p>
            RegistrationDetails
            </p>
        </main>
        <Footer />
    </>)
}
