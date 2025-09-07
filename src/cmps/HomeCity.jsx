import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from "prop-types"

export function HomeCity({ index, city, citiesNames, propertiesCount, selected, onCityPress }) {   

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

    const handleCityPress = () => {
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
                            ? citiesNames?.find(c => c.key === "else")?.value 
                            : citiesNames?.find(c => c.key === city)?.value
                        : ""    
                    

    return (
        <article role='button' tabIndex={0} className={divClass} onClick={handleCityPress} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleCityPress() }>
            {cityIcon && <img src={cityIcon} alt='' />}
            <div>
                {cityLabel} 
                <span className='desktop'>({propertiesCount === 1 ? "נכס אחד" : `${propertiesCount} נכסים`})</span>
                <span className='tablet'>({propertiesCount})</span>
            </div>
        </article>
    )
}

HomeCity.propTypes = {
    index: PropTypes.number,
    city: PropTypes.string,
    citiesNames: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })
    ),
    propertiesCount: PropTypes.number,
    selected: PropTypes.bool,
    onCityPress: PropTypes.func,
}