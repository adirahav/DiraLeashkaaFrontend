import { useEffect, useState } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { UserFinancialDetails } from '../cmps/UserFinancialDetails'
import { useSelector } from 'react-redux'
import { utilService } from '../services/util.service'
import { FormField } from '../cmps/FormField'
import { userService } from '../services/user.service'
import { logService } from '../services/log.service'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { useSplash } from "../contexts/SplashContext"
import { updateUser } from '../store/actions/user.actions.js'
import { v4 as uuid } from 'uuid'

export function FinancialDetailsPage() {

    const TAG = "FinancialDetailsPage"
    
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const { splash } = useSplash()
    const phrases = splash?.phrases

    const defultInputState = (name, labelKey, value, errorKey, tooltipKey, maxLength) => {
        return {
            name,
            label: utilService.getPhrase(labelKey, phrases), 
            value: value === 0 ? "0" : utilService.formatNumber(value),
            error: utilService.getPhrase(errorKey, phrases), 
            //tooltip: utilService.getPhrase(tooltipKey, phrases), 
            maxLength,
            hasError: false
        }
    }

    const defultButtonState = (textKey) => {
        return {
            text: utilService.getPhrase(textKey, phrases), 
            isDisabled: true,
            isVisible: true,
            isLinkView: false
        }
    }

    const defultStringState = (name, labelKey, value, errorKey, tooltipKey, maxLength) => {
        return {
            name,
            label: utilService.getPhrase(labelKey, phrases), 
            value,
            error: utilService.getPhrase(errorKey, phrases), 
            tooltip: utilService.getPhrase(tooltipKey, phrases),  
            maxLength,
            hasError: false
        }
    }

    const [financialDetails, setFinancialDetails ] = useState({
        equity: defultInputState("equity", "signup_equity_label", loggedinUser?.equity, "signup_equity_error", "signup_equity_tooltip", 100),
        incomes: defultInputState("incomes", "signup_incomes_label", loggedinUser?.incomes, "signup_incomes_error", "signup_incomes_tooltip"),
        commitments: defultInputState("commitments", "signup_commitments_label", loggedinUser?.commitments, "signup_commitments_error", "signup_commitments_tooltip"),
        additionalFundingSources: loggedinUser?.additionalFundingSources?.map(item => ({
            source: defultStringState(
                "source",
                "signup_additional_funding_sources_source_label",
                item.source,
                100,
                "signup_additional_funding_sources_source_error",
                "signup_additional_funding_sources_source_tooltip"
            ),
            amount: defultInputState(
                "amount",
                "signup_additional_funding_sources_amount_label",
                item.amount,
                "signup_additional_funding_sources_amount_error",
                "signup_additional_funding_sources_amount_tooltip"
            ),
            repayment: defultInputState(
                "repayment",
                "signup_additional_funding_sources_repayment_label",
                item.repayment,
                "signup_commitments_error",
                "signup_additional_funding_sources_repayment_tooltip"
            ),
            uuid: item.uuid
        } || []))
            
        
    })

    const [note, setNote] = useState({text: null, type: "error"})
    const [submit, setSubmit] = useState(defultButtonState("button_save"))

    useEffect(() => {
        if (!phrases) {
            onLoadingStart()  
        } else {
            onLoadingDone()  
        }
        
    }, [phrases])

    useEffect(() => {
        if (financialDetails) {
            let hasError = false

            Object.entries(financialDetails).forEach(([fieldValue]) => {
                if (fieldValue.value === undefined && fieldValue.hasError === undefined) {
                    return
                }
                if (fieldValue.value === null || fieldValue.value === undefined || fieldValue.value === "" || fieldValue.hasError) {
                    hasError = true
                }
            })

            setSubmit(prevSubmit => ({ ...prevSubmit, isDisabled: hasError }))
        }
    }, [financialDetails])

    /*function handleValueChanged(fieldName, value, hasError) {
        setFinancialDetails((prevFinancialDetails) => {
            return { ...prevFinancialDetails, [fieldName]: {...prevFinancialDetails[fieldName], value, hasError} }
        })
    }*/

    function handleValueChanged(field, value) {
        setFinancialDetails(prev => {
            const clone = structuredClone(prev)
            const parts = field.split('.')  
            
            let obj = clone
            for (let i = 0; i < parts.length - 1; i++) {
                obj = obj[parts[i]]
            }
            
            obj[parts.at(-1)].value = value
            return clone
        })
    }

    function handleValueAdded(newAdditionalFundingSource) {
        setFinancialDetails(prev => ({
            ...prev,
            additionalFundingSources: [
                ...(prev?.additionalFundingSources ?? []),
                {
                    ...newAdditionalFundingSource,
                    uuid: uuid() 
                }
            ]
        }))
    }

    function handleValueDeleted(additionalFundingSourceUUIDToRemove) {
        setFinancialDetails(prev => ({
            ...prev,
            additionalFundingSources: prev.additionalFundingSources.filter(
                item => item.uuid !== additionalFundingSourceUUIDToRemove
            )
        }))
    }

    const handleSubmit = async (event) => {
        
        event?.preventDefault()

        if (submit.isLoading) {
            return
        }
        
        const userToSave = {
            equity: utilService.parseNumber(financialDetails.equity.value),  
            incomes: utilService.parseNumber(financialDetails.incomes.value),
            commitments: utilService.parseNumber(financialDetails.commitments.value),
            additionalFundingSources: financialDetails.additionalFundingSources.map(source => ({
                source: source.source.value,
                amount: utilService.parseNumber(source.amount.value),
                repayment: utilService.parseNumber(source.repayment.value),
                uuid: source.uuid
            }))
        }
        
        try {
            setNote(prevNote => ({  ...prevNote, text: null }))
            setSubmit(prevSubmit => ({ ...prevSubmit, isLoading: true} ))
            await updateUser(userToSave)
            setNote(prevNote => ({ ...prevNote, type: "message", text: utilService.getPhrase("user_save_success", phrases) }))
        } catch(error) {
            logService.error(TAG, error)
            setNote(prevNote => ({ ...prevNote, type: "error", text: utilService.getPhrase("dialog_data_error_title", phrases) }))
        } finally {
            setSubmit(prevSubmit => ({ ...prevSubmit, isLoading: false} ))
        }
        
    }

    const keys = {
        submit: "submitDefault",
    }

    const formClass = `financial-details form ${isLoadingState ? 'loading0' : ''}`
    const titleClass = `title ${isLoadingState || !phrases ? 'loading0' : ''}`
    const noteClass = `note ${note.type}`
    const fieldsClass = `fields ${isLoadingState || !phrases ? 'loading1' : ''}`
    const footerClass = `footer ${isLoadingState || !phrases ? 'loading1' : ''}`
    
    return (<>
        <Header />
        <form className={formClass}>
            <h2 className={titleClass}>{utilService.getPhrase('user_financial_details', phrases)}</h2>
            <article className={fieldsClass}>
                <UserFinancialDetails financialDetails={financialDetails} onChange={handleValueChanged} onAddNew={handleValueAdded} onDeleteExist={handleValueDeleted} onSubmit={handleSubmit} showAdditionalFundingSources={true} />
                <div className={noteClass}>{note.text}</div>
                <FormField type={"BUTTON_SUBMIT"} key={keys.submit} params={submit} onPress={handleSubmit} />
            </article>
            {/*<article className={footerClass}></article>*/}
        </form>
        <Footer />
    </>)
}
