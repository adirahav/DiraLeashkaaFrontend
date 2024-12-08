import React from 'react'
import { HomeCity } from './HomeCity'
import { useSelector } from 'react-redux'

export function HomeCities({ citiesNames, selectedCity, onCityPress }) {   

    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    const propertiesState = useSelector(storeState => storeState.userModule.home?.properties)

    const LOADING_CITIES_COUNT = 9
    
    const normalizedCities = propertiesState?.map(property => ({
        ...property,
        city: property.city || 'else' 
      }))

    const uniqueCities = normalizedCities 
                            ? [...new Set(normalizedCities?.map(cityObj => cityObj.city))] 
                            : null

    uniqueCities?.sort((a, b) => {
        if (a === 'else') return 1
        if (b === 'else') return -1
        return a.localeCompare(b)
    })

    if (uniqueCities && uniqueCities.length > 0 && !selectedCity) {
        setTimeout(() => {
            onCityPress(uniqueCities[0])
        }, 0)
    }

    return (
        <section className="my-cities">
            {!isLoadingState && uniqueCities?.map((city, index) => (
                <HomeCity key={index} city={city} citiesNames={citiesNames} selected={selectedCity===city} onCityPress={onCityPress} />
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
