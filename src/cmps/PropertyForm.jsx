import React, { useState, useEffect } from 'react'
import { PropertyField } from './PropertyField'
import { utilService } from '../services/util.service'
import { useSplash } from '../contexts/SplashContext.jsx'
import { useSelector } from 'react-redux'
import averageReturnImage from '../assets/images/icon_best_average_return.png'
import averageReturnOnEquityImage from '../assets/images/icon_best_yield_average_return_on_equity.png'
import totalProfitImage from '../assets/images/icon_best_yield_total_profit.png'
import npvImage from '../assets/images/icon_best_yield_npv.png'
import { YieldChart } from './YieldChart.jsx'


export function PropertyForm({property, user, isFirstLoading, onUpdate, queryPropertyId}) { 

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const defultSearchableDropdownState = (labelKey, options, savedSuggested) => {
        return {
            id: null,
            label: utilService.getPhrase(labelKey, phrases), 
            selectedValue: null, 
            options: utilService.getFixedParameter(options, fixedParameters), 
            suggestedOptions: utilService.getLocalStorage("array", savedSuggested) 
        }
    }

    const defultStringState = (labelKey, maxLength) => {
        return {
            id: null,
            label: utilService.getPhrase(labelKey, phrases), 
            value: "", 
            maxLength
        }
    }

    const defultDropdownState = (labelKey, warningKey, options) => {
        return {
            id: null,
            label: utilService.getPhrase(labelKey, phrases), 
            warning: warningKey ? utilService.getPhrase(warningKey, phrases) : "", 
            options: utilService.getFixedParameter(options, fixedParameters), 
            selectedValue: null
        }
    }

    const defultNumberState = (labelKey, maxLength) => {
        return {
            id: null,
            label: utilService.getPhrase(labelKey, phrases), 
            value: null, 
            maxLength
        }
    }
   
    const defultAutoFillState = (labelKey, maxLength) => {
        return {
            id: null,
            label: utilService.getPhrase(labelKey, phrases), 
            value: null, 
            defaultValue: null, 
            maxLength
        }
    }

    const defultCalcState = (labelKey, warningKey) => {
        return {
            id: null,
            label: utilService.getPhrase(labelKey, phrases), 
            warning: warningKey ? utilService.getPhrase(warningKey, phrases) : "", 
            value: null
        }
    }

    const defultYieldsState = () => {
        return {
            title: "תשואה צפויה לאחר 10 שנים",
            averageReturn: {
                label: utilService.getPhrase("home_best_yield_average_return", phrases),
                value: null,
                rightSign: '%',
                decimalPlaces: 1
            },
            averageReturnOnEquity: {
                label: utilService.getPhrase("home_best_yield_average_return_on_equity", phrases),
                value: null,
                rightSign: '%',
                decimalPlaces: 1
            },
            profit: {
                label: utilService.getPhrase("home_best_yield_total_profit", phrases),
                value: null,
                leftSign: '₪',
                decimalPlaces: 0
            }, 
            profitNpv: {
                label: utilService.getPhrase("home_best_yield_total_profit_npv", phrases), 
                value: null,
                leftSign: '₪',
                decimalPlaces: 0
            }
        }
    }
    
    const defultCalcEditableState = (labelWithPercentKey, labelWithCustomValueKey, numberPickerProperties) => {
        const propertyInputs = utilService.getFixedParameter("propertyInputs", fixedParameters)
        const numberPicker = propertyInputs?.find(prop => prop.name === numberPickerProperties)
        delete numberPicker?.name
        
        return {
            id: null,
            label: {withPercent: utilService.getPhrase(labelWithPercentKey, phrases), withCustomValue: utilService.getPhrase(labelWithCustomValueKey, phrases)},
            value: {calc: null, customValue: null, default: null}, 
            numberPicker: {...numberPicker, customPercent: null},
            isReadOnly: true
        }
    }
    
    const defultCalcTotalState = (labelKey) => {
        return {
            id: null,
            label: utilService.getPhrase(labelKey, phrases), 
            value: null
        }
    }

    const [city, setCity] = useState(defultSearchableDropdownState("property_city_label", "cities", "userCities"))
    const [cityElse, setCityElse] = useState(defultStringState("property_city_else_label", 20))
    const [address, setAddress] = useState(defultStringState("property_address_label", 30))
    const [apartmentType, setApartmentType] = useState(defultDropdownState("property_apartment_type_label", null, "apartmentTypes"))
    const [price, setPrice] = useState(defultNumberState("property_price_label", 9))
    const [equity, setEquity] = useState(defultAutoFillState("property_equity_label", 9))
    
    const [equityCleaningExpenses, setEquityCleaningExpenses] = useState(defultCalcState("property_equity_cleaning_expenses_label", "property_equity_cleaning_expenses_warning")) 
    const [mortgageRequired, setMortgageRequired] = useState(defultCalcState("property_mortgage_required_label", "property_mortgage_required_warning"))
    const [note, setNote] = useState(defultStringState("property_note_label"))
    
    const [incomes, setIncomes] = useState(defultAutoFillState("property_incomes_label", 7))  
    const [commitments, setCommitments] = useState(defultAutoFillState("property_commitments_label", 6)) 
    const [disposableIncome, setDisposableIncome] = useState(defultCalcState("property_disposable_income_label")) 
    const [possibleMonthlyRepayment, setPossibleMonthlyRepayment] = useState(defultCalcEditableState("property_possible_monthly_payment_label", "", "possibleMonthlyRepaymentPercent"))

    const [maxPercentOfFinancing, setMaxPercentOfFinancing] = useState(defultCalcState("property_max_percent_of_financing_label")) 
    const [actualPercentOfFinancing, setActualPercentOfFinancing] = useState(defultCalcState("property_actual_percent_of_financing_label", "property_actual_percent_of_financing_warning")) 
    
    const [transferTax, setTransferTax] = useState(defultCalcState("property_transfer_tax_label"))
    const [lawyer, setLawyer] = useState(defultCalcEditableState("property_lawyer_label", "property_lawyer_label_without_value", "lawyerPercent"))
    const [realEstateAgent, setRealEstateAgent] = useState(defultCalcEditableState("property_real_estate_agent_label", "property_real_estate_agent_label_without_value", "realEstateAgentPercent"))
    
    const [brokerMortgage, setBrokerMortgage] = useState(defultNumberState("property_broker_mortgage_label", 5))
    const [repairing, setRepairing] = useState(defultNumberState("property_repairing_label", 7))
    const [incidentalsTotal, setIncidentalsTotal] = useState(defultCalcTotalState("property_incidentals_total_label"))
    
    const [rent, setRent] = useState(defultCalcEditableState("property_rent_label", "property_rent_label_without_value", "rentPercent"))  
    const [lifeInsurance, setLifeInsurance] = useState(defultNumberState("property_life_insurance_label", 3))
    const [structureInsurance, setStructureInsurance] = useState(defultNumberState("property_structure_insurance_label", 3))
    const [rentCleaningExpenses, setRentCleaningExpenses] = useState(defultCalcState("property_rent_cleaning_expenses_label", ""))
    
    const [mortgagePeriod, setMortgagePeriod] = useState(defultDropdownState("property_mortgage_period_label", "property_mortgage_period_warning", "mortgagePeriods"))
    const [mortgageMonthlyRepayment, setMortgageMonthlyRepayment] = useState(defultCalcState("property_mortgage_monthly_repayment_label", "property_mortgage_monthly_repayment_warning"))
    const [mortgageMonthlyYield, setMortgageMonthlyYield] = useState(defultCalcState("property_mortgage_monthly_yield_label", "property_mortgage_monthly_yield_warning"))
    
    const [yields, setYields] = useState(defultYieldsState("property_price_label", 9))
    
    const [showMortgagePrepayment, setShowMortgagePrepayment] = useState(true)
    
    useEffect(() => {
        if (property || !queryPropertyId) {
            setTimeout(() => {
                loadProperty()
            }, [0])      
        } 
    }, [queryPropertyId, property])

    useEffect(() => {
        if (!isLoadingState && !property && !queryPropertyId && phrases) {
            setEquity({ ...equity, id: property?._id, value: user?.equity, defaultValue: user?.equity})
            setIncomes({ ...incomes, id: property?._id, value: user?.incomes, defaultValue: user?.incomes})
            setCommitments({ ...commitments, id: property?._id, value: user?.commitments, defaultValue: user?.commitments})
        }
        else if (phrases) {
            setCity({...city, label: utilService.getPhrase("property_city_label", phrases)})
            setCityElse({...cityElse, label: utilService.getPhrase("property_city_else_label", phrases)})
            setAddress({...address, label: utilService.getPhrase("property_address_label", phrases)})
            setApartmentType({...apartmentType, label: utilService.getPhrase("property_apartment_type_label", phrases)})
            
            setPrice({...price, label: utilService.getPhrase("property_price_label", phrases)})
            setEquity({...equity, label: utilService.getPhrase("property_equity_label", phrases)})
            setEquityCleaningExpenses({...equityCleaningExpenses, label: utilService.getPhrase("property_equity_cleaning_expenses_label", phrases), warning: utilService.getPhrase("property_equity_cleaning_expenses_warning", phrases)})
            setMortgageRequired({...mortgageRequired, label: utilService.getPhrase("property_mortgage_required_label", phrases), warning: utilService.getPhrase("property_mortgage_required_warning", phrases)})
            setNote({...note, label: utilService.getPhrase("property_note_label", phrases)})
            setIncomes({...incomes, label: utilService.getPhrase("property_incomes_label", phrases)})
            setCommitments({...commitments, label: utilService.getPhrase("property_commitments_label", phrases)})
            setDisposableIncome({...disposableIncome, label: utilService.getPhrase("property_disposable_income_label", phrases)})
            setPossibleMonthlyRepayment({...possibleMonthlyRepayment, label: {withPercent: utilService.getPhrase("property_possible_monthly_payment_label", phrases), withCustomValue: utilService.getPhrase("possibleMonthlyRepaymentPercent", phrases)}})
            
            setMaxPercentOfFinancing({...maxPercentOfFinancing, label: utilService.getPhrase("property_max_percent_of_financing_label", phrases)})
            setActualPercentOfFinancing({...actualPercentOfFinancing, label: utilService.getPhrase("property_actual_percent_of_financing_label", phrases), warning: utilService.getPhrase("property_actual_percent_of_financing_warning", phrases)})
            setTransferTax({...transferTax, label: utilService.getPhrase("property_transfer_tax_label", phrases)})
            
            setLawyer({...lawyer, label: {withPercent: utilService.getPhrase("property_lawyer_label", phrases), withCustomValue: utilService.getPhrase("property_lawyer_label_without_value", phrases)}})
            setRealEstateAgent({...realEstateAgent, label: {withPercent: utilService.getPhrase("property_real_estate_agent_label", phrases), withCustomValue: utilService.getPhrase("property_real_estate_agent_label_without_value", phrases)}})
            
            setBrokerMortgage({...brokerMortgage, label: utilService.getPhrase("property_broker_mortgage_label", phrases)})
            setRepairing({...repairing, label: utilService.getPhrase("property_repairing_label", phrases)})
            setIncidentalsTotal({...incidentalsTotal, label: utilService.getPhrase("property_incidentals_total_label", phrases)})
            
            setRent({...rent, label: {withPercent: utilService.getPhrase("property_rent_label", phrases), withCustomValue: utilService.getPhrase("property_rent_label_without_value", phrases)}})
            setLifeInsurance({...lifeInsurance, label: utilService.getPhrase("property_life_insurance_label", phrases)})
            setStructureInsurance({...structureInsurance, label: utilService.getPhrase("property_structure_insurance_label", phrases)})
            setRentCleaningExpenses({...rentCleaningExpenses, label: utilService.getPhrase("property_rent_cleaning_expenses_label", phrases)})
           
            setMortgagePeriod({...mortgagePeriod, label: utilService.getPhrase("property_mortgage_period_label", phrases), warning: utilService.getPhrase("property_mortgage_period_warning", phrases)})
            setMortgageMonthlyRepayment({...mortgageMonthlyRepayment, label: utilService.getPhrase("property_mortgage_monthly_repayment_label", phrases), warning: utilService.getPhrase("property_mortgage_monthly_repayment_warning", phrases)})
            setMortgageMonthlyYield({...mortgageMonthlyYield, label: utilService.getPhrase("property_mortgage_monthly_yield_label", phrases), warning: utilService.getPhrase("property_mortgage_monthly_yield_warning", phrases)})
        
            setYields({
                ...yields,
                profit: {...yields.profit, label: utilService.getPhrase("home_best_yield_total_profit", phrases)},
                profitNpv: {...yields.profitNpv, label: utilService.getPhrase("home_best_yield_total_profit_npv", phrases)},
                averageReturn: {...yields.averageReturn, label: utilService.getPhrase("home_best_yield_average_return", phrases)},
                averageReturnOnEquity: {...yields.averageReturnOnEquity, label: utilService.getPhrase("home_best_yield_average_return_on_equity", phrases)},
            })
        }

    }, [phrases, isLoadingState])


    useEffect(() => {
        console.log("ADITEST "+JSON.stringify(commitments))
    }, commitments)

    const loadProperty = () => {
        try {
        
            setCity({...city, selectedValue: property?.city})

            if (property?.updatedByField !== "cityElse") {
                setCityElse({...cityElse, value: property?.cityElse})
            }
            
            if (property?.updatedByField !== "address") {
                setAddress({...address, value: property?.address})
            }
            
            setApartmentType({...apartmentType, selectedValue: property?.apartmentType})

            if (property?.updatedByField !== "price") {
                setPrice({...price, value: property?.price})
            }
            
            if (property?.updatedByField !== "equity" || !queryPropertyId) {
                setEquity({
                    ...equity, 
                    id: property?._id, 
                    value: queryPropertyId ? property?.calcEquity : user?.equity, 
                    defaultValue: queryPropertyId ? property?.defaultEquity : user?.equity
                })
            }

            setEquityCleaningExpenses({
                ...equityCleaningExpenses, 
                value: property?.calcEquityCleaningExpenses,
                hasWarning: property?.calcEquityCleaningExpenses < 0
            })
            setMortgageRequired({
                ...mortgageRequired, 
                value: property?.calcMortgageRequired,
                hasWarning: !user.calcCanTakeMortgage && property?.calcMortgageRequired > 0
            })

            if (property?.updatedByField !== "note") {
                setNote({...note, value: property?.note})
            }

            if (property?.updatedByField !== "incomes" || !queryPropertyId) {
                setIncomes({
                    ...incomes, 
                    id: property?._id, 
                    value: queryPropertyId ? property?.calcIncomes : user?.incomes, 
                    defaultValue: queryPropertyId ? property?.defaultIncomes : user?.incomes
                })
            }

            if (property?.updatedByField !== "commitments" || !queryPropertyId) {
                setCommitments({
                    ...commitments, 
                    id: property?._id, 
                    value: queryPropertyId ? property?.calcCommitments : user?.commitments, 
                    defaultValue: queryPropertyId ? property?.defaultCommitments : user?.commitments
                })
            }

            setDisposableIncome({...disposableIncome, value: property?.calcDisposableIncome})

            setPossibleMonthlyRepayment({...possibleMonthlyRepayment, 
                value: {calc: property?.calcPossibleMonthlyRepayment, customValue: property?.possibleMonthlyRepaymentCustomValue, default: property?.defaultPossibleMonthlyRepayment},
                numberPicker: {...possibleMonthlyRepayment.numberPicker, customPercent: property?.calcPossibleMonthlyRepaymentPercent},
                isReadOnly: true
            }) 

            setMaxPercentOfFinancing({...maxPercentOfFinancing, value: property?.calcMaxPercentOfFinancing})

            setActualPercentOfFinancing({
                ...actualPercentOfFinancing, 
                value: property?.calcActualPercentOfFinancing,
                hasWarning: property?.calcActualPercentOfFinancing === null || property?.calcMaxPercentOfFinancing === null
                                ? false
                                : property?.calcActualPercentOfFinancing > property?.calcMaxPercentOfFinancing
            })

            setTransferTax({...transferTax, value: property?.calcTransferTax})
            
            setLawyer({
                ...lawyer, 
                id: property?._id, 
                value: {calc: property?.calcLawyer, customValue: property?.lawyerCustomValue, default: property?.defaultLawyer},
                numberPicker: {...lawyer.numberPicker, customPercent: property?.calcLawyerPercent},
                isReadOnly: false
            })        
            setRealEstateAgent({
                ...realEstateAgent, 
                id: property?._id, 
                value: {calc: property?.calcRealEstateAgent, customValue: property?.realEstateAgentCustomValue, default: property?.defaultRealEstateAgent},
                numberPicker: {...realEstateAgent.numberPicker, customPercent: property?.calcRealEstateAgentPercent},
                isReadOnly: false,
            })    
            
            if (property?.updatedByField !== "brokerMortgage") {
                setBrokerMortgage({...brokerMortgage, value: property?.calcBrokerMortgage})
            }

            if (property?.updatedByField !== "repairing") {
                setRepairing({...repairing, value: property?.calcRepairing})
            }

            setIncidentalsTotal({...incidentalsTotal, value: property?.calcIncidentalsTotal})

            setRent({...rent, 
                value: {calc: property?.calcRent, customValue: property?.rentCustomValue, default: property?.defaultRent},
                numberPicker: {...rent.numberPicker, customPercent: property?.calcRentPercent},
                isReadOnly: false
            })        

            if (property?.updatedByField !== "lifeInsurance") {
                setLifeInsurance({...lifeInsurance, value: property?.calcLifeInsurance})
            }

            if (property?.updatedByField !== "structureInsurance") {
                setStructureInsurance({...structureInsurance, value: property?.calcStructureInsurance})
            }

            setRentCleaningExpenses({
                ...rentCleaningExpenses, 
                value: property?.calcRentCleaningExpenses
            })

            setMortgagePeriod({
                ...mortgagePeriod, 
                selectedValue: property?.calcMortgagePeriod,
                hasWarning: property?.calcMortgagePeriod !== null 
                         && user.calcAge !== null 
                         && utilService.getFixedParameter("mortgageMaxAge", fixedParameters) != null
                         && property?.calcMortgagePeriod + user.calcAge > utilService.getFixedParameter("mortgageMaxAge", fixedParameters)
            })
            setMortgageMonthlyRepayment({
                ...mortgageMonthlyRepayment, 
                value: property?.calcMortgageMonthlyRepayment,
                hasWarning: property?.calcMortgageMonthlyRepayment !== null && property?.calcMortgageMonthlyRepayment > property?.calcPossibleMonthlyRepayment
            })
            setMortgageMonthlyYield({
                ...mortgageMonthlyYield, 
                value: property?.calcMortgageMonthlyYield,
                hasWarning: property?.calcMortgageMonthlyYield !== null && property?.calcMortgageMonthlyYield < 0
            })
            
            setShowMortgagePrepayment(property?.showMortgagePrepayment)

            setYields({
                ...yields,
                profit: {...yields.profit, value: property?.yields?.profit},
                profitNpv: {...yields.profitNpv, value: property?.yields?.profitNpv},
                averageReturn: {...yields.averageReturn, value: property?.yields?.averageReturn},
                averageReturnOnEquity: {...yields.averageReturnOnEquity, value: property?.yields?.averageReturnOnEquity},
            })

            
        } catch (error) {
            console.error(`Error load property ${property?._id || queryPropertyId}:`, error)
        } 
    }

    function onValueChanged(fieldName, value) {
        onUpdate(fieldName, value) 
    }

    function onPercentChanged(fieldName, customPercent) {
        /*switch (fieldName) {
            case "lawyer":
                setLawyer((prevLawyer) => {
                    const calc = !customPercent || customPercent.toString() === prevLawyer.numberPicker.default.toString() ? prevLawyer.value.default : 7200 // TO DELETE
                    return {
                        ...prevLawyer, 
                        value: {
                            ...prevLawyer.value, 
                            calc,
                            customValue: null
                        },
                        numberPicker: {
                            ...prevLawyer.numberPicker, 
                            customPercent: null, 
                        }
                    }
                })
                break
            case "realEstateAgentPercent":
                    setRealEstateAgent((prevRealEstateAgent) => {
                        const calc = !customPercent || customPercent.toString() === prevRealEstateAgent.numberPicker.default.toString() ? prevRealEstateAgent.value.default : 18000 // TO DELETE
                        return {
                            ...prevRealEstateAgent, 
                            value: {
                                ...prevRealEstateAgent.value, 
                                calc,
                                customValue: null
                            },
                            numberPicker: {
                                ...prevRealEstateAgent.numberPicker, 
                                customPercent: null, 
                            }
                        }
                    })
                    break
                case "rent":
                    setRent((prevRent) => {
                        const calc = !customPercent || customPercent.toString() === prevRent.numberPicker.default.toString() ? prevRent.value.default : 3000 // TO DELETE
                        return {
                            ...prevRent, 
                            value: {
                                ...prevRent.value, 
                                calc,
                                customValue: null
                            },
                            numberPicker: {
                                ...prevRent.numberPicker, 
                                customPercent: null, 
                            }
                        }
                    })
                    break
        }  */
        
        onUpdate(fieldName, customPercent) 
    }

    const keys = {
        city: "city" + (city.selectedValue ? city.selectedValue : "Default"),
        cityElse: "cityElse" + (cityElse.value ? cityElse.value : "Default"),
        address: "address" + (address.value ? address.value : "Default"),
        apartmentType: "apartmentType" + (apartmentType.selectedValue ? apartmentType.selectedValue : "Default"),
        price: "price" + (price.value !== null ? price.value : "Default"),
        equity: "equity" + (equity.value !== null ? equity.value : "Default"),
        equityCleaningExpenses: "equityCleaningExpenses" + (equityCleaningExpenses.value !== null ? equityCleaningExpenses.value : "Default"),
        mortgageRequired: "mortgageRequired" + (mortgageRequired.value ? mortgageRequired.value : "Default"),
        note: "note" + (note.value ? note.value : "Default"),
        
        incomes: "incomes" + (incomes.value !== null ? incomes.value : "Default"),
        commitments: "commitments" + (commitments.value !== null ? commitments.value : "Default"),
        disposableIncome: "disposableIncome" + (disposableIncome.value ? disposableIncome.value : "Default"),
        possibleMonthlyRepayment: "possibleMonthlyRepayment" + (possibleMonthlyRepayment.value ? possibleMonthlyRepayment.value : "Default"),

        maxPercentOfFinancing: "maxPercentOfFinancing" + (maxPercentOfFinancing.value ? maxPercentOfFinancing.value : "Default"),
        actualPercentOfFinancing: "actualPercentOfFinancing" + (actualPercentOfFinancing.value ? actualPercentOfFinancing.value : "Default"),
        
        transferTax: "transferTax" + (transferTax.value !== null ? transferTax.value : "Default"),
        lawyer: "lawyer" + (lawyer.value !== null ? lawyer.value : "Default"),
        realEstateAgent: "realEstateAgent" + (realEstateAgent.value !== null ? realEstateAgent.value : "Default"),
        
        brokerMortgage: "brokerMortgage" + (brokerMortgage.value !== null ? brokerMortgage.value : "Default"),
        repairing: "repairing" + (repairing.value !== null ? repairing.value : "Default"),
        incidentalsTotal: "incidentalsTotal" + (incidentalsTotal.value !== null ? incidentalsTotal.value : "Default"),
        
        rent: "rent" + (rent.value !== null ? rent.value : "Default"),
        lifeInsurance: "lifeInsurance" + (lifeInsurance.value !== null ? lifeInsurance.value : "Default"),
        structureInsurance: "structureInsurance" + (structureInsurance.value !== null ? structureInsurance.value : "Default"),
        rentCleaningExpenses: "rentCleaningExpenses" + (rentCleaningExpenses.value ? rentCleaningExpenses.value : "Default"),
        
        mortgagePeriod: "mortgagePeriod" + (mortgagePeriod.value !== null ? mortgagePeriod.value : "Default"),
        mortgageMonthlyRepayment: "mortgageMonthlyRepayment" + (mortgageMonthlyRepayment.value !== null ? mortgageMonthlyRepayment.value : "Default"),
        mortgageMonthlyYield: "mortgageMonthlyYield" + (mortgageMonthlyYield.value !== null ? mortgageMonthlyYield.value : "Default"),
    
        yieldProfit: "yieldProfit" + (yields.profit.value !== null ? yields.profit.value : "Default"),
        yieldProfitNpv: "yieldProfitNpv" + (yields.profitNpv.value !== null ? yields.profitNpv.value : "Default"),
        yieldAverageReturn: "yieldAverageReturn" + (yields.averageReturn.value !== null ? yields.averageReturn.value : "Default"),
        yieldAverageReturnOnEquity: "yieldAverageReturnOnEquity" + (yields.averageReturnOnEquity.value !== null ? yields.averageReturnOnEquity.value : "Default"),
    }

    const [cityLogoIcon, setCityLogoIcon] = useState(null)

    useEffect(() => {
        (async () => {
            if (!isLoadingState) {
                const iconPath = await getCityLogoIcon(city)
                setCityLogoIcon(iconPath)
            }
        })()
    }, [city, isLoadingState])

    const getCityLogoIcon = async (city) => {
        try {
            const module = await import(`../assets/images/icon_city_${city.selectedValue === 'choose' || !city.selectedValue ? 'else' : city.selectedValue}.png`)
            return module.default
        } catch (error) {
            const fallback = await import('../assets/images/icon_city_else.png')
            return fallback.default
        }
    }
    
    // best yield
    const bestYieldTitle = !isLoadingState && phrases && fixedParameters
                            ? utilService.getPhrase("calculator_compare_best_yield_title", phrases)
                                         .replace("%1$d", utilService.getFixedParameter("bestYield", fixedParameters)
                                                                     .find(item => item.key === "yearsPeriod").value)
                            : ''
     
    const sectionClass = `form ${city.selectedValue === "else" ? "city-else" : ""}`
    const cityLogoClass = (isFirstLoading ? ' loading1' : '')
    const h3Class = isFirstLoading ? 'loading0' : ''
    const hrClass = isFirstLoading ? 'loading9' : ''

    return (<>
        <section className={sectionClass}>
            <article>
                <PropertyField type={"SEARCHABLE_DROP_DOWN"} key={keys.city} params={city} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('city', value)} />
                {city.selectedValue === "else" && <PropertyField type={"STRING"} key={keys.cityElse} params={cityElse} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('cityElse', value)} />}
                <PropertyField type={"STRING"} key={keys.address} params={address} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('address', value)} />
                <PropertyField type={"DROP_DOWN"} key={keys.apartmentType} params={apartmentType} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('apartmentType', value)} />
                <PropertyField type={"NUMBER"} key={keys.price} params={price} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('price', value)} />
                <PropertyField type={"AUTO_FILL"} key={keys.equity} params={equity} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('equity', value)} />
                <PropertyField type={"CALC"} key={keys.equityCleaningExpenses} params={equityCleaningExpenses} isFirstLoading={isFirstLoading} />
                <PropertyField type={"CALC"} key={keys.mortgageRequired} params={mortgageRequired} isFirstLoading={isFirstLoading} />
                <PropertyField type={"TEXT_AREA"} key={keys.note} params={note} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('note', value)} />
            </article>
             
            <hr className={hrClass} />

            <article>
                <PropertyField type={"AUTO_FILL"} key={keys.incomes} params={incomes} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('incomes', value)} />    
                <PropertyField type={"AUTO_FILL"} key={keys.commitments} params={commitments} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('commitments', value)} />   
                <PropertyField type={"CALC"} key={keys.disposableIncome} params={disposableIncome} isFirstLoading={isFirstLoading} />
                <PropertyField type={"CALC_EDITABLE"} key={keys.possibleMonthlyRepayment} params={possibleMonthlyRepayment} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('possibleMonthlyRepaymentCustomValue', value)} onPercentChanged={(percent) => onPercentChanged('possibleMonthlyRepaymentPercent', percent)} />    
            </article>

            <hr className={hrClass} />

            <article>
                <PropertyField type={"CALC"} key={keys.maxPercentOfFinancing} params={maxPercentOfFinancing} isFirstLoading={isFirstLoading} />
                <PropertyField type={"CALC"} key={keys.actualPercentOfFinancing} params={actualPercentOfFinancing} isFirstLoading={isFirstLoading} />
            </article>

            <hr className={hrClass} />

            <article>
                <h3 className={h3Class}>{utilService.getPhrase("property_incidentals_title", phrases)}</h3>
                <PropertyField type={"CALC"} key={keys.transferTax} params={transferTax} isFirstLoading={isFirstLoading} />
                <PropertyField type={"CALC_EDITABLE"} key={keys.lawyer} params={lawyer} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('lawyerCustomValue', value)} onPercentChanged={(percent) => onPercentChanged('lawyerPercent', percent)} />    
                <PropertyField type={"CALC_EDITABLE"} key={keys.realEstateAgent} params={realEstateAgent} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('realEstateAgentCustomValue', value)} onPercentChanged={(percent) => onPercentChanged('realEstateAgentPercent', percent)} />    
                <PropertyField type={"NUMBER"} key={keys.brokerMortgage} params={brokerMortgage} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('brokerMortgage', value)} />
                <PropertyField type={"NUMBER"} key={keys.repairing} params={repairing} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('repairing', value)} />     
                <PropertyField type={"CALC_TOTAL"} key={keys.incidentalsTotal} params={incidentalsTotal} isFirstLoading={isFirstLoading} />
            </article>

            <hr className={hrClass} />

            <article>
                <PropertyField type={"CALC_EDITABLE"} key={keys.rent} params={rent} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('rentCustomValue', value)} onPercentChanged={(percent) => onPercentChanged('rentPercent', percent)} />    
                <PropertyField type={"NUMBER"} key={keys.lifeInsurance} params={lifeInsurance} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('lifeInsurance', value)} />    
                <PropertyField type={"NUMBER"} key={keys.structureInsurance} params={structureInsurance} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('structureInsurance', value)} />    
                <PropertyField type={"CALC_TOTAL"} key={keys.rentCleaningExpenses} params={rentCleaningExpenses} isFirstLoading={isFirstLoading} />
            </article>

            <hr className={hrClass} />

            {property?.showMortgagePrepayment && <article>
                <h3 className={h3Class}>{utilService.getPhrase("property_mortgage_repayment_title", phrases)}</h3>
                <PropertyField type={"DROP_DOWN"} key={keys.mortgagePeriod} params={mortgagePeriod} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('mortgagePeriod', value)} />
                <PropertyField type={"CALC"} key={keys.mortgageMonthlyRepayment} params={mortgageMonthlyRepayment} isFirstLoading={isFirstLoading} />
                <PropertyField type={"CALC"} key={keys.mortgageMonthlyYield} params={mortgageMonthlyYield} isFirstLoading={isFirstLoading} />
            </article>}

            {property?.yields && <>
                <hr className={hrClass} />
                <h3 className={h3Class} dangerouslySetInnerHTML={{ __html: bestYieldTitle}}></h3>
                <ul className='yields'>
                    <li>
                        <img src={averageReturnImage} />
                        <PropertyField type={"CALC_TOTAL"} key={keys.yieldAverageReturn} params={yields.averageReturn} isFirstLoading={isFirstLoading} />
                    </li>
                    <li>
                        <img src={averageReturnOnEquityImage} />
                        <PropertyField type={"CALC_TOTAL"} key={keys.yieldAverageReturnOnEquity} params={yields.averageReturnOnEquity} isFirstLoading={isFirstLoading} />
                    </li>
                    <li>
                        <img src={totalProfitImage} />
                        <PropertyField type={"CALC_TOTAL"} key={keys.yieldProfit} params={yields.profit} isFirstLoading={isFirstLoading} />
                    </li>
                    <li>
                        <img src={npvImage} />
                        <PropertyField type={"CALC_TOTAL"} key={keys.yieldProfitNpv} params={yields.profitNpv} isFirstLoading={isFirstLoading} />
                    </li>
                </ul>
                {/*<div className='chart'>
                    <YieldChart rawData={JSON.parse(property?.calcYieldForecast)} />
                </div>*/}
            </>}
            
        </section>    
    </>
    )
}
