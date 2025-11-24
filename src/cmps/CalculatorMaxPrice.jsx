import { useState, useEffect } from 'react'
import PropTypes from "prop-types"
import { PropertyField } from './PropertyField.jsx'
import { utilService } from '../services/util.service.js'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { useSplash } from "../contexts/SplashContext"
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

    const loggedinUserState = useSelector(storeState => storeState.userModule.loggedinUser)
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
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
       if (!isLoadingState  && !isFirstLoading && !property) {
            setEquity(prevEquity => ({ ...prevEquity, value: loggedinUserState?.equity, defaultValue: loggedinUserState?.equity }))
            setIncomes(prevIncomes => ({ ...prevIncomes, value: loggedinUserState?.incomes, defaultValue: loggedinUserState?.incomes }))
            setCommitments(prevCommitments => ({ ...prevCommitments,value: loggedinUserState?.commitments, defaultValue: loggedinUserState?.commitments }))
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
            setApartmentType(prevApartmentType => ({ ...prevApartmentType, selectedValue: property.apartmentType }))
            
            setPrice(prevPrice => ({ ...prevPrice, value: property.price }))
            
            if (property.updatedByField !== "equity") {
                setEquity(prevEquity => ({ ...prevEquity, value: property.calcEquity, defaultValue: property.defaultEquity }))
            }

            setEquityCleaningExpenses(prevEquityCleaningExpenses => ({ 
                ...prevEquityCleaningExpenses, 
                value: property.calcEquityCleaningExpenses,
                hasWarning: property.calcEquityCleaningExpenses < 0
            }))
            
            setMortgageRequired(prevMortgageRequired => ({
                ...prevMortgageRequired, 
                value: property.calcMortgageRequired,
                hasWarning: !loggedinUserState.calcCanTakeMortgage && property.calcMortgageRequired > 0
            }))
            
            if (property.updatedByField !== "incomes") {
                setIncomes(prevIncomes => ({ ...prevIncomes, value: property.calcIncomes, defaultValue: property.defaultIncomes }))
            }

            if (property.updatedByField !== "commitments") {
                setCommitments(prevCommitments => ({ ...prevCommitments, value: property.calcCommitments, defaultValue: property.defaultCommitments }))
            }

            setDisposableIncome(prevDisposableIncome => ({...prevDisposableIncome, value: property.calcDisposableIncome}))
            setPossibleMonthlyRepayment(prevPossibleMonthlyRepayment => ({...prevPossibleMonthlyRepayment, 
                value: {calc: property.calcPossibleMonthlyRepayment, customValue: property.possibleMonthlyRepaymentCustomValue, default: property.defaultPossibleMonthlyRepayment},
                numberPicker: {...prevPossibleMonthlyRepayment.numberPicker, customPercent: property.calcPossibleMonthlyRepaymentPercent},
                isReadOnly: true
            })) 

            setMaxPercentOfFinancing(prevMaxPercentOfFinancing => ({...prevMaxPercentOfFinancing, value: property.calcMaxPercentOfFinancing}))
            setActualPercentOfFinancing(prevActualPercentOfFinancing => ({...prevActualPercentOfFinancing, 
                value: property.calcActualPercentOfFinancing,
                hasWarning: property.calcActualPercentOfFinancing === null || property.calcMaxPercentOfFinancing === null
                                ? false
                                : property.calcActualPercentOfFinancing > property.calcMaxPercentOfFinancing
            }))

            setTransferTax(prevTransferTax => ({...prevTransferTax, value: property.calcTransferTax}))
            
            setLawyer(prevLawyer => ({...prevLawyer, 
                value: {calc: property.calcLawyer, customValue: property.lawyerCustomValue, default: property.defaultLawyer},
                numberPicker: {...prevLawyer.numberPicker, customPercent: property.calcLawyerPercent},
                isReadOnly: false
            }))       
            setRealEstateAgent(prevRealEstateAgent => ({...prevRealEstateAgent, 
                value: {calc: property.calcRealEstateAgent, customValue: property.realEstateAgentCustomValue, default: property.defaultRealEstateAgent},
                numberPicker: {...prevRealEstateAgent.numberPicker, customPercent: property.calcRealEstateAgentPercent},
                isReadOnly: false,
            }))    
            
            if (property.updatedByField !== "brokerMortgage") {
                setBrokerMortgage(prevBrokerMortgage => ({...prevBrokerMortgage, value: property.calcBrokerMortgage}))
            }

            if (property.updatedByField !== "repairing") {
                setRepairing(prevRepairing => ({...prevRepairing, value: property.calcRepairing}))
            }

            setIncidentalsTotal(prevIncidentalsTotal => ({...prevIncidentalsTotal, value: property.calcIncidentalsTotal}))

            setRent(prevRent => ({...prevRent, 
                value: {calc: property.calcRent, customValue: property.rentCustomValue, default: property.defaultRent},
                numberPicker: {...prevRent.numberPicker, customPercent: property.calcRentPercent},
                isReadOnly: false
            }))    

            if (property.updatedByField !== "lifeInsurance") {
                setLifeInsurance(prevLifeInsurance => ({...prevLifeInsurance, value: property.calcLifeInsurance}))
            }

            if (property.updatedByField !== "structureInsurance") {
                setStructureInsurance(prevStructureInsurance => ({...prevStructureInsurance, value: property.calcStructureInsurance}))
            }

            setRentCleaningExpenses(prevRentCleaningExpenses => ({
                ...prevRentCleaningExpenses, 
                value: property.calcRentCleaningExpenses
            }))
            

        } catch (error) {
            console.error(`Error load property ${property._id}:`, error)
        } 
    }

    function onValueChanged(fieldName, fieldValue) {
        updateCalculator(fieldName, fieldValue === "choose" ? null : fieldValue) 
    }

    function onPercentChanged(fieldName, customPercent) {
        updateCalculator(fieldName, customPercent) 
    }

    const keys = {
        maxPrice: "maxPrice" + (maxPrice ? maxPrice : "Default"),
        apartmentType: "apartmentType" + (apartmentType.selectedValue ? apartmentType.selectedValue : "Default"),
        equity: "equity" + (equity.value !== null ? equity.value : "Default"),
        equityCleaningExpenses: "equityCleaningExpenses" + (equityCleaningExpenses.value ? equityCleaningExpenses.value : "Default"),
        mortgageRequired: "mortgageRequired" + (mortgageRequired.value ? mortgageRequired.value : "Default"),
        
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
        repairing: "repairing" + (repairing.value ? repairing.value !== null : "Default"),
        incidentalsTotal: "incidentalsTotal" + (incidentalsTotal.value !== null ? incidentalsTotal.value : "Default"),
        
        rent: "rent" + (rent.value !== null ? rent.value : "Default"),
        lifeInsurance: "lifeInsurance" + (lifeInsurance.value !== null ? lifeInsurance.value : "Default"),
        structureInsurance: "structureInsurance" + (structureInsurance.value !== null ? structureInsurance.value : "Default"),
        rentCleaningExpenses: "rentCleaningExpenses" + (rentCleaningExpenses.value ? rentCleaningExpenses.value : "Default"),
    }

    const h3Class = isFirstLoading ? 'loading0' : ''
    const hrClass = isFirstLoading ? 'loading9' : ''

    return (<>
        {showOverlay && <Overlay />}
        <h1>{utilService.getPhrase(`calculator_title_max_price`, phrases)}</h1>
        <section className="form">
            <article>
                <h3>{utilService.getPhrase(`calculator_maxprice_price_label`, phrases)}</h3>
                <h2>{utilService.getPhrase(`calculator_maxprice_price_nis`, phrases).replace("%1$s", maxPrice ? utilService.formatNumber(maxPrice, true) : "???")}</h2>
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

CalculatorMaxPrice.propTypes = {
    property: PropTypes.shape({
      calcBrokerMortgage: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      calcRepairing: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      calcIncidentalsTotal: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      calcRent: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      rentCustomValue: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      defaultRent: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      calcRentPercent: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      updatedByField: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      calcLifeInsurance: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      calcStructureInsurance: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      calcRentCleaningExpenses: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
    }),
}

