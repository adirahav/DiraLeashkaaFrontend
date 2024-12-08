import React from 'react'
import { utilService } from '../services/util.service'
import { useSelector } from 'react-redux'

export function HomeCity({ index, city, citiesNames, selected, onCityPress }) {   

    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const handleCityPress = (ev) => {
        if (city) {
            onCityPress(city)
        }
    }

    const divClass = selected 
                        ? 'selected' 
                        : isLoadingState
                            ? `loading${index}`
                            : ''

    const cityIcon = !isLoadingState 
                        ? `/src/assets/images/icon_city_${city ? city : 'else'}.png`
                        : ''
    
    const cityLabel = !isLoadingState
                        ? !city || city === "else"
                            ? citiesNames?.find(c => c.key === "else").value 
                            : citiesNames?.find(c => c.key === city).value
                        : ""    
                    

    return (
        <article className={divClass} onClick={() => handleCityPress(this)}>
            <div>{cityIcon && <img src={cityIcon} />}</div>
            <span>{cityLabel}</span>
        </article>
    )
}
