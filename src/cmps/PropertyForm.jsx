import React, { useCallback, useState, useEffect } from 'react'
import { FormField } from './FormField'
import { utilService } from '../services/util.service'
//import { propertyService } from '../services/property.service'


export function PropertyForm({propertyId}) {   
    useEffect(() => {
        fetchProperty()
    }, [propertyId])

    const fetchProperty = async () => {
        try {
            //const property = await propertyService.getById(propertyId)
           
        } catch (error) {
            console.error(`Error fetching property ${propertyId}:`, error)
            /*showErrorAlert({
                title: "Error",
                message: "Sorry, there was a problem with your request.",
                closeButton: { show: false }, 
                okButton: { show: true, text: "OK", onPress: null, closeAfterPress: true }, 
                cancelButton: { show: false }, 
            })*/
        } 
    }

    const [city, setCity] = useState({label: "עיר", selectedValue: "azur", options: [
        {key:"choose",value:"בחר"},
        {key:"umm_el_fahm",value:"אום אל פאחם"},
        {key:"or_yehuda",value:"אור יהודה"},
        {key:"azur",value:"אזור"},
        {key:"ashdod",value:"אשדוד"},
        {key:"ashkelon",value:"אשקלון"},
        {key:"bne_brak",value:"בני ברק"},
        {key:"ramat_gan",value:"רמת גן"}], suggestedOptions: [
            "ashdod","ashkelon","xxx"]})

    const [cityElse, setCityElse] = useState({label: "שם היישוב", value: "כפר מעש", maxLength: 20})
    const [address, setAddress] = useState({label: "כתובת", value: "ארבע העונות", maxLength: 30})
    const [apartmentType, setApartmentType] = useState({label: "סוג דירה", options: [
        {key:"choose",value:"בחר"},
        {key:"single",value:"יחידה"},
        {key:"alternate",value:"חליפית"},
        {key:"investment",value:"השקעה"}], selectedValue: "single"})

    const [price, setPrice] = useState({label: "מחיר הנכס", value: 840000, maxLength: 9})
    const [equity, setEquity] = useState({label: "הון עצמי", value: 550000, defaultValue: 500000, maxLength: 9})
    const equityCleaningExpenses = {label: "הון עצמי בניכוי הוצאות נלוות", value: 423000} 
    const mortgageRequired = {label: "משכנתה נדרשת", value: 1000000}
    const [incomes, setIncomes] = useState({label: "הכנסות", value: 50000, defaultValue: 40000, maxLength: 7})
    const [commitments, setCommitments] = useState({label: "הלוואות והתחייבויות", value: 3000, defaultValue: 2000, maxLength: 6})
    const disposableIncome = {label: "הכנסה פנויה", value: 47000}
    const transferTax = {label: "מס רכישה", value: 80000}
    const [lawyer, setLawyer] = useState({
        label: {withPercent: "עורך דין <u>%1$.1f&percnt;</u>", withCustomValue: "עורך דין"},
        value: {calc: 5000, customValue: null, default: 5000}, 
        numberPicker: {"min": 0, "max": 2, "step": 0.1, "default": 0.5, customPercent: null}})
    const [realEstateAgent, setRealEstateAgent] = useState({
        label: {withPercent: "מתווך <u>%1$.1f&percnt;</u>", withCustomValue: "מתווך"},
        value: {calc: 20000, customValue: null, default: 20000}, 
        numberPicker: {"min": 0, "max": 2, "step": 0.1, "default": 2.0, customPercent: null}})    
    const [brokerMortgage, setBrokerMortgage] = useState({label: "יועץ משכנתאות", value: 5000, maxLength: 5})
    const [repairing, setRepairing] = useState({label: "שיפוץ", value: 25000, maxLength: 7})
    const incidentalsTotal = {label: "סהכ", value: 100000}
    const [rent, setRent] = useState({
        label: {withPercent: "צפי לשכר דירה <u>%1$.1f&percnt;</u>", withCustomValue: "צפי לשכר דירה"},
        value: {calc: 3500, customValue: null, default: 3300}, 
        numberPicker: {"min": 0, "max": 5, "step": 0.1, "default": 3.0, customPercent: null}})    
    const [lifeInsurance, setLifeInsurance] = useState({label: "ביטוח חיים", value: 60, maxLength: 3})
    const [structureInsurance, setStructureInsurance] = useState({label: "ביטוח מבנה", value: 70, maxLength: 3})
    const rentCleaningExpenses = {label: "שכר דירה בניכוי הו'", value: 3150}
    const [mortgagePeriod, setMortgagePeriod] = useState({label: "תקופה", options: [
        {key:"choose",value:"בחר"},
        {key:"20",value:"20 שנה"},
        {key:"25",value:"25 שנה"},
        {key:"30",value:"30 שנה"}], selectedValue: 20})
    const mortgageMonthlyRepayment = {label: "החזר חודשי", value: 3350}
    const mortgageMonthlyYield = {label: "תשואה חודשית", value: 1200}

    const debouncedSetValue = useCallback(utilService.debounce(onValueChanged, 500), [])
    const debouncedSetPercent = useCallback(utilService.debounce(onPercentChanged, 500), [])

    function onValueChanged(fieldName, value) {
        console.log("onValueChanged: " + fieldName + " = " + value)
        switch (fieldName) {
            case "cityElse": 
                setCityElse({...cityElse, value})
                break
            case "address": 
                setAddress({...address, value})
                break
            case "apartmentType":
                setApartmentType({...apartmentType, selectedValue: value})    
            case "price": 
                setPrice({...price, value})
                break
            case "equity":
                setEquity({...equity, value})
                break
            case "incomes": 
                setIncomes({...incomes, value})
                break
            case "commitments": 
                setCommitments({...commitments, value})
                break
            case "lawyer":
                setLawyer((prevLawyer) => {
                    return {...prevLawyer, 
                        value: {
                            ...prevLawyer.value, 
                            calc: value.toString === "" || value.toString() === prevLawyer.value.default.toString() ? prevLawyer.value.default : null, 
                            customValue: value
                        },
                        numberPicker: {
                            ...prevLawyer.numberPicker, 
                            customPercent: null, 
                        }
                    }
                })
                break
            case "realEstateAgent":
                setRealEstateAgent((prevRealEstateAgent) => {
                    return {...prevRealEstateAgent, 
                        value: {
                            ...prevRealEstateAgent.value, 
                            calc: value.toString === "" || value.toString() === prevRealEstateAgent.value.default.toString() ? prevRealEstateAgent.value.default : null, 
                            customValue: value
                        },
                        numberPicker: {
                            ...prevRealEstateAgent.numberPicker, 
                            customPercent: null, 
                        }
                    }
                })
                break
            case "brokerMortgage":
                setBrokerMortgage({...brokerMortgage, value})
                break
            case "repairing":
                setRepairing({...repairing, value})
                break    
            case "rent":
                setRent((prevRent) => {
                    return {...prevRent, 
                        value: {
                            ...prevRent.value, 
                            calc: value.toString === "" || value.toString() === prevRent.value.default.toString() ? prevRent.value.default : null, 
                            customValue: value
                        },
                        numberPicker: {
                            ...prevRent.numberPicker, 
                            customPercent: null, 
                        }
                    }
                })
                break
            case "lifeInsurance":
                setLifeInsurance({...lifeInsurance, value})    
                break
            case "structureInsurance":
                setStructureInsurance({...structureInsurance, value})    
                break
            case "mortgagePeriod":
                setMortgagePeriod({...mortgagePeriod, selectedValue: value})    
        }
    }

    function onPercentChanged(fieldName, customPercent) {
        switch (fieldName) {
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
            case "realEstateAgent":
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
        }   
    }

    return (
        <section className="form">
            <FormField type={"SEARCHABLE_DROP_DOWN"} params={city} onValueChanged={(value) => debouncedSetValue('city', value)} />
            <FormField type={"STRING"} params={cityElse} onValueChanged={(value) => debouncedSetValue('cityElse', value)} />
            <FormField type={"STRING"} params={address} onValueChanged={(value) => debouncedSetValue('address', value)} />

            <FormField type={"DROP_DOWN"} params={apartmentType} onValueChanged={(value) => debouncedSetValue('apartmentType', value)} />

            <FormField type={"NUMBER"} params={price} onValueChanged={(value) => debouncedSetValue('price', value)} />
            <FormField type={"AUTO_FILL"} params={equity} onValueChanged={(value) => debouncedSetValue('equity', value)} />
            <FormField type={"CALC"} params={equityCleaningExpenses} />
            <FormField type={"CALC"} params={mortgageRequired} />
            
            <hr />

            <FormField type={"AUTO_FILL"} params={incomes} onValueChanged={(value) => debouncedSetValue('incomes', value)} />    
            <FormField type={"AUTO_FILL"} params={commitments} onValueChanged={(value) => debouncedSetValue('commitments', value)} />   
            <FormField type={"CALC"} params={disposableIncome} />

            <hr />

            <h3>הוצאות נלוות</h3>
            <FormField type={"CALC"} params={transferTax} />
            <FormField type={"CALC_EDITABLE"} params={lawyer} onValueChanged={(value) => debouncedSetValue('lawyer', value)} onPercentChanged={(percent) => debouncedSetPercent('lawyer', percent)} />    
            <FormField type={"CALC_EDITABLE"} params={realEstateAgent} onValueChanged={(value) => debouncedSetValue('realEstateAgent', value)} onPercentChanged={(percent) => debouncedSetPercent('realEstateAgent', percent)} />    
            <FormField type={"NUMBER"} params={brokerMortgage} onValueChanged={(value) => debouncedSetValue('brokerMortgage', value)} />
            <FormField type={"NUMBER"} params={repairing} onValueChanged={(value) => debouncedSetValue('repairing', value)} />     
            <FormField type={"CALC_TOTAL"} params={incidentalsTotal} />

            <hr />

            <FormField type={"CALC_EDITABLE"} params={rent} onValueChanged={(value) => debouncedSetValue('rent', value)} onPercentChanged={(percent) => debouncedSetPercent('rent', percent)} />    
            <FormField type={"NUMBER"} params={lifeInsurance} onValueChanged={(value) => debouncedSetValue('lifeInsurance', value)} />    
            <FormField type={"NUMBER"} params={structureInsurance} onValueChanged={(value) => debouncedSetValue('structureInsurance', value)} />    
            <FormField type={"CALC"} params={rentCleaningExpenses} />
            
            <hr />

            <h3>החזר משכנתא</h3>
            <FormField type={"DROP_DOWN"} params={mortgagePeriod} onValueChanged={(value) => debouncedSetValue('mortgagePeriod', value)} />

            <FormField type={"CALC"} params={mortgageMonthlyRepayment} />
            <FormField type={"CALC"} params={mortgageMonthlyYield} />
            
            
        </section>
        
    )
}
