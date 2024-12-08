

import React, { useCallback, useEffect, useState } from 'react'
import { utilService } from '../services/util.service'
import { PropertyField } from './PropertyField'
import { ZoomIn } from '../assets/icons'
import { useSplash } from '../contexts/SplashContext'

export function PropertyInterests({property, display, onUpdate, onCloseInterests}) {   

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    const defultCalcEditableState = (labelKey, numberPickerProperties) => {
        const indexesAndInterests = utilService.getFixedParameter("array", "indexesAndInterests", fixedParameters)
        const numberPicker = indexesAndInterests.find(prop => prop.name === numberPickerProperties)
        delete numberPicker.name
        
        return {
            label: utilService.getPhrase(labelKey, phrases),
            numberPicker: {...numberPicker, customPercent: null},
        }
    }

    const [interest, setInterest] = useState(defultCalcEditableState("property_interest_label", "interestPercent"))
    const [interestIn5Years, setInterestIn5Years] = useState(defultCalcEditableState("property_interest_in_5_years_label", "interestIn5YearsPercent"))
    const [interestIn10Years, setInterestIn10Years] = useState(defultCalcEditableState("property_interest_in_10_years_label", "interestIn10YearsPercent"))
    const [averageInterestAtTaking, setAverageInterestAtTaking] = useState(defultCalcEditableState("property_average_interest_at_taking_label", "averageInterestAtTakingPercent"))
    const [averageInterestAtMaturity, setAverageInterestAtMaturity] = useState(defultCalcEditableState("property_average_interest_at_maturity_label", "averageInterestAtMaturityPercent"))
    
    const [index, setIndex] = useState(defultCalcEditableState("property_index_label", "indexPercent"))
    const [forecastAnnualPriceIncrease, setForecastAnnualPriceIncrease] = useState(defultCalcEditableState("property_forecast_annual_price_increase_label", "forecastAnnualPriceIncreasePercent"))
    const [salesCosts, setSalesCosts] = useState(defultCalcEditableState("property_sales_costs_label", "salesCostsPercent"))
    const [depreciationForTaxPurposes, setDepreciationForTaxPurposes] = useState(defultCalcEditableState("property_depreciation_for_tax_purposes_label", "depreciationForTaxPurposesPercent"))
    
    useEffect(() => {
        if (property) {
            loadProperty()
        }
    }, [property])

    const loadProperty = () => {
        try {
            setInterest({...interest, 
                numberPicker: {...interest.numberPicker, default: utilService.formatFloat(property.defaultInterestPercent), customPercent: property.calcInterestPercent}
            })        

            setInterestIn5Years({...interestIn5Years, 
                numberPicker: {
                    ...interestIn5Years.numberPicker, 
                    default: utilService.formatFloat(property.calcInterestPercent + interestIn5Years.numberPicker.delta), 
                    customPercent: property.calcInterestIn5YearsPercent
                }
            }) 

            setInterestIn10Years({...interestIn10Years, 
                numberPicker: {
                    ...interestIn10Years.numberPicker, 
                    default: utilService.formatFloat(property.calcInterestPercent + interestIn10Years.numberPicker.delta), 
                    customPercent: property.calcInterestIn10YearsPercent}
            })

            setAverageInterestAtTaking({...averageInterestAtTaking, 
                numberPicker: {...averageInterestAtTaking.numberPicker, default: utilService.formatFloat(property.defaultAverageInterestAtTakingPercent), customPercent: property.calcAverageInterestAtTakingPercent}
            })

            setAverageInterestAtMaturity({...averageInterestAtMaturity, 
                numberPicker: {...averageInterestAtMaturity.numberPicker, default: utilService.formatFloat(property.defaultAverageInterestAtMaturityPercent), customPercent: property.calcAverageInterestAtMaturityPercent}
            })



            setIndex({...index, 
                numberPicker: {...index.numberPicker, default: utilService.formatFloat(property.defaultIndexPercent), customPercent: property.calcIndexPercent}
            }) 

            setForecastAnnualPriceIncrease({...forecastAnnualPriceIncrease, 
                numberPicker: {...forecastAnnualPriceIncrease.numberPicker, default: utilService.formatFloat(property.defaultForecastAnnualPriceIncreasePercent), customPercent: property.calcForecastAnnualPriceIncreasePercent}
            }) 

            setSalesCosts({...salesCosts, 
                numberPicker: {...salesCosts.numberPicker, default: utilService.formatFloat(property.defaultSalesCostsPercent), customPercent: property.calcSalesCostsPercent}
            }) 

            setDepreciationForTaxPurposes({...depreciationForTaxPurposes, 
                numberPicker: {...depreciationForTaxPurposes.numberPicker, default: utilService.formatFloat(property.defaultDepreciationForTaxPurposesPercent), customPercent: property.calcDepreciationForTaxPurposesPercent}
            })
        } catch (error) {
            console.error(`Error load property ${property._id}:`, error)
        } 
    }

    function onPercentChanged(fieldName, customPercent) {
        onUpdate(fieldName, customPercent) 
    }

    const keys = {
        interest: "interest" + (interest.interestPercent ? interest.interestPercent : "Default"),
        interest: "interestIn5Years" + (interestIn5Years.interestIn5YearsPercent ? interestIn5Years.interestIn5YearsPercent : "Default"),
        interest: "interestIn10Years" + (interestIn10Years.interestIn10YearsPercent ? interestIn10Years.interestIn10YearsPercent : "Default"),
        interest: "averageInterestAtTaking" + (averageInterestAtTaking.averageInterestAtTakingPercent ? averageInterestAtTaking.averageInterestAtTakingPercent : "Default"),
        interest: "averageInterestAtMaturity" + (averageInterestAtMaturity.averageInterestAtMaturityPercent ? averageInterestAtMaturity.averageInterestAtMaturityPercent : "Default"),
        
        interest: "index" + (index.indexPercent ? index.indexPercent : "Default"),
        interest: "forecastAnnualPriceIncrease" + (forecastAnnualPriceIncrease.forecastAnnualPriceIncreasePercent ? forecastAnnualPriceIncrease.forecastAnnualPriceIncreasePercent : "Default"),
        interest: "salesCosts" + (salesCosts.salesCostsPercent ? salesCosts.salesCostsPercent : "Default"),
        interest: "depreciationForTaxPurposes" + (depreciationForTaxPurposes.depreciationForTaxPurposesPercent ? depreciationForTaxPurposes.depreciationForTaxPurposesPercent : "Default"),    
    }

    const mainClass = `interests ${display ? "show" : ""}`
    
    return (
        <section className={mainClass}>
            <ZoomIn className='zoom-in' onClick={onCloseInterests} />
            <PropertyField type={"PERCENT"} key={keys.interest} params={interest} onPercentChanged={(percent) => onPercentChanged('interestPercent', percent)} />    
            <PropertyField type={"PERCENT"} key={keys.interestIn5Years} params={interestIn5Years} onPercentChanged={(percent) => onPercentChanged('interestIn5YearsPercent', percent)} />    
            <PropertyField type={"PERCENT"} key={keys.interestIn10Years} params={interestIn10Years} onPercentChanged={(percent) => onPercentChanged('interestIn10YearsPercent', percent)} /> 
            <PropertyField type={"PERCENT"} key={keys.averageInterestAtTaking} params={averageInterestAtTaking} onPercentChanged={(percent) => onPercentChanged('averageInterestAtTakingPercent', percent)} />    
            <PropertyField type={"PERCENT"} key={keys.averageInterestAtMaturity} params={averageInterestAtMaturity} onPercentChanged={(percent) => onPercentChanged('averageInterestAtMaturityPercent', percent)} />    
            
            <PropertyField type={"PERCENT"} key={keys.index} params={index} onPercentChanged={(percent) => onPercentChanged('indexPercent', percent)} />    
            <PropertyField type={"PERCENT"} key={keys.forecastAnnualPriceIncrease} params={forecastAnnualPriceIncrease} onPercentChanged={(percent) => onPercentChanged('forecastAnnualPriceIncreasePercent', percent)} />    
            <PropertyField type={"PERCENT"} key={keys.salesCosts} params={salesCosts} onPercentChanged={(percent) => onPercentChanged('salesCostsPercent', percent)} />    
            <PropertyField type={"PERCENT"} key={keys.depreciationForTaxPurposes} params={depreciationForTaxPurposes} onPercentChanged={(percent) => onPercentChanged('depreciationForTaxPurposesPercent', percent)} />    
        </section>
    )
}
