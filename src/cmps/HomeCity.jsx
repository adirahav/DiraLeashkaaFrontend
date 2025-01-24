import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export function HomeCity({ index, city, citiesNames, selected, onCityPress }) {   

    const [cityIcon, setCityIcon] = useState(null)

    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    const isDeletingState = useSelector(storeState => storeState.userModule.home.isDeleting)
    
    useEffect(() => {
        (async () => {
            if (!isLoadingState) {
                const iconPath = await getCityIcon(city)
                setCityIcon(iconPath)
            }
        })()
    }, [city, isLoadingState])

    const getCityIcon = async (city) => {
        try {
            const module = await import(`../assets/images/icon_city_${city || 'else'}.png`)
            return module.default
        } catch (error) {
            const fallback = await import('../assets/images/icon_city_else.png')
            return fallback.default
        }
    }

    const handleCityPress = (ev) => {
        if (city && !isDeletingState) {
            onCityPress(city)
        }
    }

    const divClass = selected 
                        ? 'selected' 
                        : isLoadingState
                            ? `loading${index}`
                            : ''

    const cityLabel = !isLoadingState
                        ? !city || city === "else"
                            ? citiesNames?.find(c => c.key === "else").value 
                            : citiesNames?.find(c => c.key === city).value
                        : ""    
                    

    return (
        <article className={divClass} onClick={() => handleCityPress(this)}>
            {cityIcon && <img src={cityIcon} />}
            <span>{cityLabel}</span>
        </article>
    )
}
