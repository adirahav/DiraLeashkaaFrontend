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
            tooltip: utilService.getPhrase(tooltipKey, phrases), 
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

    const [financialDetails, setFinancialDetails ] = useState({
        equity: defultInputState("equity", "signup_equity_label", loggedinUser?.equity, "signup_equity_error", "signup_equity_tooltip"),
        incomes: defultInputState("incomes", "signup_incomes_label", loggedinUser?.incomes, "signup_incomes_error", "signup_incomes_tooltip"),
        commitments: defultInputState("commitments", "signup_commitments_label", loggedinUser?.commitments, "signup_commitments_error", "signup_commitments_tooltip")
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

    function handleValueChanged(fieldName, value, hasError) {
        setFinancialDetails((prevFinancialDetails) => {
            return { ...prevFinancialDetails, [fieldName]: {...prevFinancialDetails[fieldName], value, hasError} }
        })
    }

    const handleSubmit = async (event) => {
        
        event?.preventDefault()

        if (submit.isLoading) {
            return
        }

        const userToSave = {
            "equity": utilService.parseNumber(financialDetails.equity.value),  
            "incomes": utilService.parseNumber(financialDetails.incomes.value),
            "commitments": utilService.parseNumber(financialDetails.commitments.value)
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
                <UserFinancialDetails financialDetails={financialDetails} onChange={handleValueChanged} onSubmit={handleSubmit} />
                <div className={noteClass}>{note.text}</div>
                <FormField type={"BUTTON_SUBMIT"} key={keys.submit} params={submit} onPress={handleSubmit} />
            </article>
            {/*<article className={footerClass}></article>*/}
        </form>
        <Footer />
    </>)
}
