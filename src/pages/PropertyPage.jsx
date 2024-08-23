import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { HomeCities } from '../cmps/HomeCities'
import { PropertyForm } from '../cmps/PropertyForm'
import { PropertyInterests } from '../cmps/PropertyInterests'
import { PropertyYield } from '../cmps/PropertyYield'

export function PropertyPage() {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const propertyId = queryParams.get('propertyId')
    
    return (<>
        <Header />
            <main className="property container">
                <PropertyForm propertyId={propertyId} />
                <section className="data lock">
                    <div className="unavailable-overlay">
                        <img src="/assets/images/missing_data.png" />
                        <div>
                            חסרים נתונים תקינים לחישוב
                        </div>
                    </div>
                    <PropertyInterests />
                    <PropertyYield />
                </section>
            </main>
        <Footer />
    </>)
}
