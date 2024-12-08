import React from 'react'
import { utilService } from '../services/util.service'
import averageReturnImage from '../assets/images/icon_best_average_return.png'
import averageReturnOnEquityImage from '../assets/images/icon_best_yield_average_return_on_equity.png'
import totalProfitImage from '../assets/images/icon_best_yield_total_profit.png'
import npvImage from '../assets/images/icon_best_yield_npv.png'
import { YieldChart } from './YieldChart'
import { useSplash } from '../contexts/SplashContext'

export function HomeBestYield({ property }) {   

    const { splash } = useSplash()
    const phrases = splash?.phrases
    
    return (
        <>
            {property && <>
                <h2>{property.address}</h2>
                <div>
                    <div className='data'>
                        <article>
                            <h3>{utilService.getPhrase("home_best_yield_average_return", phrases)}</h3>
                            <img src={averageReturnImage} />
                            <span>{utilService.percentFormat(property.averageReturn)}</span>
                        </article>
                        <article>
                            <h3>{utilService.getPhrase("home_best_yield_average_return_on_equity", phrases)}</h3>
                            <img src={averageReturnOnEquityImage} />
                            <span>{utilService.percentFormat(property.averageReturnOnEquity)}</span>
                        </article>
                        <article>
                            <h3>{utilService.getPhrase("home_best_yield_total_profit", phrases)}</h3>
                            <img src={totalProfitImage} />
                            <span>{utilService.priceFormat(property.profit)}</span>
                        </article>
                        <article>
                            <h3>{utilService.getPhrase("home_best_yield_total_profit_npv", phrases)}</h3>
                            <img src={npvImage} />
                            <span>{utilService.priceFormat(property.profitNpv)}</span>
                        </article>
                    </div>
                    <div className='chart'>
                        <YieldChart rawData={JSON.parse(property.yieldForecast)} />
                    </div>
                </div>
            </>}
            {!property && <>
                <h2 className='loading0'></h2>
                <div>
                    <div className='data'>
                        <article className='loading0' />
                        <article className='loading1' />
                        <article className='loading2' />
                        <article className='loading3' />
                    </div>
                    <div className='chart loading4' />
                </div>
            </>}
        </>
    )
}
