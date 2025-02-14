import React from 'react'
import { HomeBestYield } from './HomeBestYield'
import { useSelector } from 'react-redux'
import iconMissingData from '../assets/images/missing_data.png'
import { useSplash } from '../contexts/SplashContext.jsx'
import { LoadingIcon } from '../assets/icons.jsx'

export function HomeBestYields({ properties, fullData }) { 
    const { splash } = useSplash()
    const phrases = splash?.phrases
  
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)

    const hasBestYield = !isLoadingState && properties && properties?.length > 0 

    return (
        <section className="best-yields">
            {hasBestYield && fullData && <HomeBestYield property={properties?properties[0]:null} />}
            {!hasBestYield && fullData &&
                <div className="no-yields">
                    <h3>חסרים נתונים לחישוב</h3>
                    <img src={iconMissingData} />
                </div>}
            {!isLoadingState && fullData === false && <div className='loading'><LoadingIcon /></div>}
        </section>
    )
}
