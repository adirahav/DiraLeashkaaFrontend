import { HomeProperty } from './HomeProperty'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

export function HomeProperties({ selectedCity, bestYield, fullData, onPropertyPress }) {   

    const LOADING_PROPERTIES_COUNT = 6
    
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    const propertiesState = useSelector(storeState => storeState.userModule.home?.properties)

    const selectedCityProperties = 
        propertiesState?.filter(property => 
            selectedCity === 'else' 
                ? !property.city || property.city === "else" 
                : property.city === selectedCity)

    return (
        <section className="my-properties">
            {!isLoadingState && selectedCityProperties?.map((property, index) => (    
                <HomeProperty key={index} property={{ ...property, calcYieldForecast: parseFloat(property.calcYieldForecast) }}  isBestYield={bestYield?._id===property._id} fullData={fullData} onPropertyPress={onPropertyPress} />
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

HomeProperties.propTypes = {
    selectedCity: PropTypes.string,
    bestYield: PropTypes.shape({
        _id: PropTypes.string,
    }),
    fullData: PropTypes.bool,
    onPropertyPress: PropTypes.func.isRequired,
}
