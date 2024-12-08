import React from 'react'
import { HomeProperty } from './HomeProperty'
import { useSelector } from 'react-redux'

export function HomeProperties({ selectedCity, bestYield, onPropertyPress }) {   

    const LOADING_PROPERTIES_COUNT = 6
    
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    const propertiesState = useSelector(storeState => storeState.userModule.home?.properties)

    const propertyToAdd = !isLoadingState && propertiesState?.length > 0 ? { city: propertiesState[0].city } : null

    const selectedCityProperties = 
        propertiesState?.filter(property => 
            selectedCity === 'else' 
                ? !property.city || property.city === "else" 
                : property.city === selectedCity)

    return (
        <section className="my-properties">
            {!isLoadingState && selectedCityProperties?.map((property, index) => (    
                <HomeProperty key={index} property={property} isBestYield={bestYield?._id===property._id} onPropertyPress={onPropertyPress} />
            ))}
            {/*!isLoadingState &&
                <HomeProperty key={-1} index={-1} property={propertyToAdd} onPropertyPress={onPropertyPress} />
            */}
            {isLoadingState && 
                <>
                    {[...Array(LOADING_PROPERTIES_COUNT)].map((_, index) => (
                        <HomeProperty key={index} index={index} />
                    ))}
                </>
            }
        </section>
    )
}
