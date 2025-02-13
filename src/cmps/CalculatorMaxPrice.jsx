import React, { useState, useEffect } from 'react'
import { PropertyField } from './PropertyField.jsx'
import { utilService } from '../services/util.service.js'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { useSplash } from '../contexts/SplashContext.jsx'
import { useSelector } from 'react-redux'
import { authService } from '../services/auth.service.js'
import { calculatorService } from '../services/calculator.service.js'
import { useNavigate } from 'react-router-dom'
import { Overlay } from './Overlay.jsx'

export function CalculatorMaxPrice() { 

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    const navigate = useNavigate()

    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    const loggedinUser = authService.getLoggedinUser()

    const [property, setProperty] = useState()
    const [isFirstLoading, setIsFirstLoading] = useState(true)
    const [showOverlay, setShowOverlay] = useState(false)

    useEffect(() => {
        if (!isLoadingState && isFirstLoading) {
            fetchCalculator()  
        } 
    }, [isLoadingState])

    const fetchCalculator = async () => {
        try {
            onLoadingStart()  
            setShowOverlay(true)
            const property = await calculatorService.getMaxPrice()
            setProperty(property)   
            setIsFirstLoading(false)
            setShowOverlay(false)
        } catch (error) {
            console.error(`Error fetching calculator maxPrice:`, error)
            navigate("/home") 
        } 
        finally {
            onLoadingDone()  
        }
    }

    const updateCalculator = async (fieldName, fieldValue) => {
        try {
            onLoadingStart()  
            setShowOverlay(true)
            const property = await calculatorService.updateMaxPrice(fieldName, fieldValue)
            setProperty(property)   
            setIsFirstLoading(false)
            setShowOverlay(false)
        } catch (error) {
            console.error(`Error update calculator maxPrice:`, error)
            navigate("/home") 
        } 
        finally {
            onLoadingDone()  
        }
    }

    const defultDropdownState = (labelKey, warningKey, options) => {
        return {
            label: utilService.getPhrase(labelKey, phrases), 
            warning: warningKey ? utilService.getPhrase(warningKey, phrases) : "", 
            options: utilService.getFixedParameter(options, fixedParameters), 
            selectedValue: null
        }
    }

    const defultNumberState = (labelKey, maxLength) => {
        return {
            label: utilService.getPhrase(labelKey, phrases), 
            value: null, 
            maxLength
        }
    }

    const defultAutoFillState = (labelKey, userKey, maxLength) => {
        return {
            id: property?._id,
            label: utilService.getPhrase(labelKey, phrases), 
            value: null, 
            defaultValue: null, 
            maxLength
        }
    }

    const defultCalcState = (labelKey, warningKey) => {
        return {
            label: utilService.getPhrase(labelKey, phrases), 
            warning: warningKey ? utilService.getPhrase(warningKey, phrases) : "", 
            value: null
        }
    }
    
    const defultCalcEditableState = (labelWithPercentKey, labelWithCustomValueKey, numberPickerProperties) => {
        const propertyInputs = utilService.getFixedParameter("propertyInputs", fixedParameters)
        const numberPicker = propertyInputs?.find(prop => prop.name === numberPickerProperties)
        delete numberPicker?.name
        
        return {
            label: {withPercent: utilService.getPhrase(labelWithPercentKey, phrases), withCustomValue: utilService.getPhrase(labelWithCustomValueKey, phrases)},
            value: {calc: null, customValue: null, default: null}, 
            numberPicker: {...numberPicker, customPercent: null},
            isReadOnly: true
        }
    }
    
    const defultCalcTotalState = (labelKey) => {
        return {
            label: utilService.getPhrase(labelKey, phrases), 
            value: null
        }
    }

    const [maxPrice, setMaxPrice] = useState(0)
    const [apartmentType, setApartmentType] = useState(defultDropdownState("property_apartment_type_label", null, "apartmentTypes"))
    const [price, setPrice] = useState(defultNumberState("property_price_label", 9))
    const [equity, setEquity] = useState(defultAutoFillState("property_equity_label", 9))
    const [equityCleaningExpenses, setEquityCleaningExpenses] = useState(defultCalcState("property_equity_cleaning_expenses_label", "property_equity_cleaning_expenses_warning")) 
    const [mortgageRequired, setMortgageRequired] = useState(defultCalcState("property_mortgage_required_label", "property_mortgage_required_warning"))
    
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
    
    useEffect(() => {
        if (property) {
            loadProperty()
        } 
    }, [property])

    useEffect(() => {
        if (!isLoadingState && !property) {
            setEquity({ ...equity, value: loggedinUser?.equity, defaultValue: loggedinUser?.equity})
            setIncomes({ ...incomes, value: loggedinUser?.incomes, defaultValue: loggedinUser?.incomes})
            setCommitments({ ...commitments, value: loggedinUser?.commitments, defaultValue: loggedinUser?.commitments})
        }
    }, [isLoadingState])

    useEffect(() => {
        setMaxPrice(
            price?.value 
                ? price.value
                : ""
        )
    }, [price?.value])

    const loadProperty = () => {
        try {
            setApartmentType({...apartmentType, selectedValue: property.apartmentType})
            
            setPrice({...price, value: property.price})

            if (property.updatedByField !== "equity") {
                setEquity({...equity, value: property.calcEquity, defaultValue: property.defaultEquity})
            }

            setEquityCleaningExpenses({
                ...equityCleaningExpenses, 
                value: property.calcEquityCleaningExpenses,
                hasWarning: property.calcEquityCleaningExpenses < 0
            })
            setMortgageRequired({
                ...mortgageRequired, 
                value: property.calcMortgageRequired,
                hasWarning: !loggedinUser.calcCanTakeMortgage && property.calcMortgageRequired > 0
            })
            
            if (property.updatedByField !== "incomes") {
                setIncomes({...incomes, value: property.calcIncomes, defaultValue: property.defaultIncomes})
            }

            if (property.updatedByField !== "commitments") {
                setCommitments({...commitments, value: property.calcCommitments, defaultValue: property.defaultCommitments})
            }

            setDisposableIncome({...disposableIncome, value: property.calcDisposableIncome})
            setPossibleMonthlyRepayment({...possibleMonthlyRepayment, 
                value: {calc: property.calcPossibleMonthlyRepayment, customValue: property.possibleMonthlyRepaymentCustomValue, default: property.defaultPossibleMonthlyRepayment},
                numberPicker: {...possibleMonthlyRepayment.numberPicker, customPercent: property.calcPossibleMonthlyRepaymentPercent},
                isReadOnly: true
            }) 

            setMaxPercentOfFinancing({...maxPercentOfFinancing, value: property.calcMaxPercentOfFinancing})
            setActualPercentOfFinancing({...actualPercentOfFinancing, 
                value: property.calcActualPercentOfFinancing,
                hasWarning: property.calcActualPercentOfFinancing === null || property.calcMaxPercentOfFinancing === null
                                ? false
                                : property.calcActualPercentOfFinancing > property.calcMaxPercentOfFinancing
            })

            setTransferTax({...transferTax, value: property.calcTransferTax})
            
            setLawyer({...lawyer, 
                value: {calc: property.calcLawyer, customValue: property.lawyerCustomValue, default: property.defaultLawyer},
                numberPicker: {...lawyer.numberPicker, customPercent: property.calcLawyerPercent},
                isReadOnly: false
            })        
            setRealEstateAgent({...realEstateAgent, 
                value: {calc: property.calcRealEstateAgent, customValue: property.realEstateAgentCustomValue, default: property.defaultRealEstateAgent},
                numberPicker: {...realEstateAgent.numberPicker, customPercent: property.calcRealEstateAgentPercent},
                isReadOnly: false,
            })    
            
            if (property.updatedByField !== "brokerMortgage") {
                setBrokerMortgage({...brokerMortgage, value: property.calcBrokerMortgage})
            }

            if (property.updatedByField !== "repairing") {
                setRepairing({...repairing, value: property.calcRepairing})
            }

            setIncidentalsTotal({...incidentalsTotal, value: property.calcIncidentalsTotal})

            setRent({...rent, 
                value: {calc: property.calcRent, customValue: property.rentCustomValue, default: property.defaultRent},
                numberPicker: {...rent.numberPicker, customPercent: property.calcRentPercent},
                isReadOnly: false
            })        

            if (property.updatedByField !== "lifeInsurance") {
                setLifeInsurance({...lifeInsurance, value: property.calcLifeInsurance})
            }

            if (property.updatedByField !== "structureInsurance") {
                setStructureInsurance({...structureInsurance, value: property.calcStructureInsurance})
            }

            setRentCleaningExpenses({
                ...rentCleaningExpenses, 
                value: property.calcRentCleaningExpenses
            })

        } catch (error) {
            console.error(`Error load property ${property._id}:`, error)
        } 
    }

    function onValueChanged(fieldName, fieldValue) {
        updateCalculator(fieldName, fieldValue === "choose" ? null : fieldValue) 
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
        
        updateCalculator(fieldName, customPercent) 
    }

    const keys = {
        maxPrice: "maxPrice" + (maxPrice ? maxPrice : "Default"),
        apartmentType: "apartmentType" + (apartmentType.selectedValue ? apartmentType.selectedValue : "Default"),
        equity: "equity" + (equity.value ? equity.value : "Default"),
        equityCleaningExpenses: "equityCleaningExpenses" + (equityCleaningExpenses.value ? equityCleaningExpenses.value : "Default"),
        mortgageRequired: "mortgageRequired" + (mortgageRequired.value ? mortgageRequired.value : "Default"),
        
        incomes: "incomes" + (incomes.value ? incomes.value : "Default"),
        commitments: "commitments" + (commitments.value ? commitments.value : "Default"),
        disposableIncome: "disposableIncome" + (disposableIncome.value ? disposableIncome.value : "Default"),
        possibleMonthlyRepayment: "possibleMonthlyRepayment" + (possibleMonthlyRepayment.value ? possibleMonthlyRepayment.value : "Default"),

        maxPercentOfFinancing: "maxPercentOfFinancing" + (maxPercentOfFinancing.value ? maxPercentOfFinancing.value : "Default"),
        actualPercentOfFinancing: "actualPercentOfFinancing" + (actualPercentOfFinancing.value ? actualPercentOfFinancing.value : "Default"),
        
        transferTax: "transferTax" + (transferTax.value ? transferTax.value : "Default"),
        lawyer: "lawyer" + (lawyer.value ? lawyer.value : "Default"),
        realEstateAgent: "realEstateAgent" + (realEstateAgent.value ? realEstateAgent.value : "Default"),
        
        brokerMortgage: "brokerMortgage" + (brokerMortgage.value ? brokerMortgage.value : "Default"),
        repairing: "repairing" + (repairing.value ? repairing.value : "Default"),
        incidentalsTotal: "incidentalsTotal" + (incidentalsTotal.value ? incidentalsTotal.value : "Default"),
        
        rent: "rent" + (rent.value ? rent.value : "Default"),
        lifeInsurance: "lifeInsurance" + (lifeInsurance.value ? lifeInsurance.value : "Default"),
        structureInsurance: "structureInsurance" + (structureInsurance.value ? structureInsurance.value : "Default"),
        rentCleaningExpenses: "rentCleaningExpenses" + (rentCleaningExpenses.value ? rentCleaningExpenses.value : "Default"),
        
    }

    const h3Class = isFirstLoading ? 'loading0' : ''
    const hrClass = isFirstLoading ? 'loading9' : ''

    return (<>
        {showOverlay && <Overlay />}
        <h1>{utilService.getPhrase(`calculator_title_max_price`, phrases)}</h1>
        <section className="form">
            <article>
                <h3>מחיר דירה מקסימלי:</h3>
                <h2>{maxPrice ? utilService.formatNumber(maxPrice, true) : "???"} ש"ח</h2>
            </article>
            <article>
                <PropertyField type={"DROP_DOWN"} key={keys.apartmentType} params={apartmentType} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('apartmentType', value)} />
                <PropertyField type={"AUTO_FILL"} key={keys.equity} params={equity} isFirstLoading={isFirstLoading} onValueChanged={(value) => onValueChanged('equity', value)} />
                <PropertyField type={"CALC"} key={keys.equityCleaningExpenses} params={equityCleaningExpenses} isFirstLoading={isFirstLoading} />
                <PropertyField type={"CALC"} key={keys.mortgageRequired} params={mortgageRequired} isFirstLoading={isFirstLoading} />
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
                <PropertyField type={"CALC"} key={keys.rentCleaningExpenses} params={rentCleaningExpenses} isFirstLoading={isFirstLoading} />            
            </article>
        </section>    
    </>
    )
}
