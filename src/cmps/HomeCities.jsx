import React, { useEffect, useState } from 'react'
import { HomeCity } from './HomeCity'
import { useSelector } from 'react-redux'

export function HomeCities({ citiesNames, selectedCity, onCityPress }) {   
    const [normalizedCities, setNormalizedCities] = useState()
    const [uniqueCities, setUniqueCities] = useState()
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    const propertiesState = useSelector(storeState => storeState.userModule.home?.properties)

    const LOADING_CITIES_COUNT = 4
    
    useEffect(() => {
        setNormalizedCities(
            propertiesState?.map(property => ({
                ...property,
                city: property.city || 'else' 
            }))
        )
    }, [propertiesState])

    useEffect(() => {
        const uniqueCities = normalizedCities 
            ? [...new Set(normalizedCities?.map(cityObj => cityObj.city))] 
            : null

        setUniqueCities(
            uniqueCities?.sort((a, b) => {
                if (a === 'else') return 1
                if (b === 'else') return -1
                return a.localeCompare(b)
            })
        )
    }, [normalizedCities])

    if (uniqueCities && uniqueCities.length > 0 && !selectedCity) {
        setTimeout(() => {
            onCityPress(uniqueCities[0])
        }, 0)
    }

    return (
        <section className="my-cities">
            {!isLoadingState && uniqueCities?.map((city, index) => (
                <HomeCity key={index} city={city} citiesNames={citiesNames} propertiesCount={normalizedCities.filter(item => item.city === city).length} selected={selectedCity===city} onCityPress={onCityPress} />
            ))}
            {isLoadingState && 
                <>
                    {[...Array(LOADING_CITIES_COUNT)].map((_, index) => (
                        <HomeCity key={index} index={index} />
                    ))}
                </>
            }
        </section>
    )
}
