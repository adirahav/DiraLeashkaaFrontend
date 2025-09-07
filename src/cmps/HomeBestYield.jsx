import { utilService } from '../services/util.service'
import averageReturnImage from '../assets/images/icon_best_average_return.png'
import averageReturnOnEquityImage from '../assets/images/icon_best_yield_average_return_on_equity.png'
import totalProfitImage from '../assets/images/icon_best_yield_total_profit.png'
import npvImage from '../assets/images/icon_best_yield_npv.png'
import { YieldChart } from './YieldChart'
import { useSplash } from '../contexts/SplashContext'
import PropTypes from "prop-types"

export function HomeBestYield({ property }) {   

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    const cityName = property?.city && property.city !== "else"
                        ? utilService.getFixedParameter("cities", fixedParameters)
                            .find(city => city.key === property.city).value
                        : property.city === "else"
                            ? property.cityElse
                            : null
    const address = property.address && cityName
                        ? property.address + ", " + cityName
                        : property.address && !cityName
                            ? property.address
                            : !property.address && cityName
                                ? cityName
                                : null
    
    return (
        <>
            {property && <>
                {address && <h2>{address}</h2>}
                <div>
                    <div className='data'>
                        <article>
                            <img src={averageReturnImage} alt='' />
                            <h3>{utilService.getPhrase("home_best_yield_average_return", phrases)}</h3>
                            <span>{utilService.percentFormat(property.averageReturn)}</span>
                        </article>
                        <article>
                            <img src={averageReturnOnEquityImage} alt='' />
                            <h3>{utilService.getPhrase("home_best_yield_average_return_on_equity", phrases)}</h3>
                            <span>{utilService.percentFormat(property.averageReturnOnEquity)}</span>
                        </article>
                        <article>
                            <img src={totalProfitImage} alt='' />
                            <h3>{utilService.getPhrase("home_best_yield_total_profit", phrases)}</h3>
                            <span>{utilService.priceFormat(property.profit)}</span>
                        </article>
                        <article>
                            <img src={npvImage} alt='' />
                            <h3>{utilService.getPhrase("home_best_yield_total_profit_npv", phrases)}</h3>
                            <span>{utilService.priceFormat(property.profitNpv)}</span>
                        </article>
                    </div>
                    <div className='chart'>
                        <YieldChart rawData={JSON.parse(property.yieldForecast)} />
                    </div>
                </div>
            </>}
            {!property && <>
                <h2 className='loading0'>&nbsp;</h2>
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

HomeBestYield.propTypes = {
    property: PropTypes.shape({
        city: PropTypes.string,
        cityElse: PropTypes.string,
        address: PropTypes.string,
        averageReturn: PropTypes.number,
        averageReturnOnEquity: PropTypes.number,
        profit: PropTypes.number,
        profitNpv: PropTypes.number,
        yieldForecast: PropTypes.string, 
    }),
}

HomeBestYield.propTypes = {
    properties: PropTypes.arrayOf(PropTypes.object), 
    fullData: PropTypes.bool
}