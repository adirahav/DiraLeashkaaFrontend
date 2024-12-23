import React, { useEffect, useState } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { useSplash } from '../contexts/SplashContext'
import { authService } from '../services/auth.service'
import { useLocation, useNavigate } from 'react-router-dom'
import { CalculatorMaxPrice } from '../cmps/CalculatorMaxPrice'
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
    
    const loggedinUser = authService.getLoggedinUser()

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
    }, [splash, calculatorId])

    /*const updateProperty = async (fieldName, fieldValue) => {
        try {
            if (fieldName === "city") {
                setProperty((prevProperty) => {
                    return {
                        ...prevProperty,
                        city: fieldValue
                    }
                })                
            }

            const propertyToUpdate = { 
                propertyId: property?._id,
                fieldName,
                fieldValue: fieldValue === '' || fieldValue === 'choose' ? null : fieldValue
            }
            
            setShowOverlay(true)
            const savedProperty = await propertyService.save(propertyToUpdate)
            setProperty({...savedProperty, updatedByField: fieldName})
            setShowOverlay(false) 
        } catch (error) {
            console.error(`Error update property ${propertyId}:`, error)
        } 
    }*/
 
    const mainClass = `calculator ${utilService.toKebabCase(type)}`

    return (<>
        <Header />
        <main className={mainClass}>
            {type === "maxPrice" && <CalculatorMaxPrice />}
        </main>
        <Footer />
    </>)
}
