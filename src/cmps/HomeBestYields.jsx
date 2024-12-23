import React, { useEffect } from 'react'
import { HomeBestYield } from './HomeBestYield'
import { useSelector } from 'react-redux'
import { utilService } from '../services/util.service'
import { useSplash } from '../contexts/SplashContext.jsx'

export function HomeBestYields({ properties }) { 
    const { splash } = useSplash()
    const phrases = splash?.phrases
  
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)

    return (
        <section className="best-yields">
            {isLoadingState || properties?.length > 0 && <HomeBestYield property={properties?properties[0]:null} />}
            {!isLoadingState && properties?.length === 0 && <span className='no-data'>{utilService.getPhrase("home_best_yield_no_details", phrases)}</span>}
        </section>
    )
}
