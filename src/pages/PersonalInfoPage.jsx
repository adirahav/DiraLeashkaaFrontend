import React, { useEffect, useState } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { UserPersonalInfo } from '../cmps/UserPersonalInfo'
import { useSelector } from 'react-redux'
import { utilService } from '../services/util.service'
import { FormField } from '../cmps/FormField'
import { logService } from '../services/log.service'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { useSplash } from '../contexts/SplashContext.jsx'
import { userService } from '../services/user.service.js'

export function PersonalInfoPage() {

    const TAG = "PersonalInfoPage"
    const YEAR_OF_BIRTH_MAX_LENGTH = 4

    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const { splash } = useSplash()
    const phrases = splash?.phrases

    const defultInputState = (name, labelKey, value, errorKey, tooltipKey, maxLength) => {
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

    const defultButtonState = (textKey) => {
        return {
            text: utilService.getPhrase(textKey, phrases), 
            isDisabled: true,
            isVisible: true,
            isLinkView: false
        }
    }

    const [personalInfo, setPersonalInfo] = useState({
        name: defultInputState("name", "signup_fullname_label", loggedinUser?.fullname, "signup_fullname_error"),
        email: defultInputState("email", "signup_email_label", loggedinUser?.email, "signup_email_error"),
        password: defultInputState("password", "signup_password_label", loggedinUser ? "********" : "", "signup_password_error"),
        yearOfBirth: defultInputState("yearOfBirth", "signup_year_of_birth_hint", loggedinUser?.yearOfBirth, "signup_year_of_birth_error", null, YEAR_OF_BIRTH_MAX_LENGTH)
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
        if (personalInfo) {
            let hasError = false

            Object.entries(personalInfo).forEach(([fieldName, fieldValue]) => {
                if (fieldValue.value === undefined && fieldValue.hasError === undefined) {
                    return
                }
                if (!fieldValue.value || fieldValue.hasError) {
                    hasError = true
                }
            })

            setSubmit({ ...submit, isDisabled: hasError })
            setNote({  ...note, text: null })
        }
    }, [personalInfo])

    function handleValueChanged(fieldName, value, hasError) {
        setPersonalInfo((prevPersonalInfo) => {
            return { ...prevPersonalInfo, [fieldName]: {...prevPersonalInfo[fieldName], value, hasError} }
        })
    }

    const handleSubmit = async (event) => {
        
        event?.preventDefault()

        if (submit.isLoading) {
            return
        }

        const userToSave = {
            "fullname": personalInfo.name.value,  
            "yearOfBirth": personalInfo.yearOfBirth.value
        }
        
        try {
            setNote({  ...note, text: null })
            setSubmit({ ...submit, isLoading: true} )
            await userService.save(userToSave)
            setNote({ ...note, type: "message", text: utilService.getPhrase("user_save_success", phrases) })
        } catch(error) {
            logService.error(TAG, error)
            setNote({ ...note, type: "error", text: utilService.getPhrase("dialog_data_error_title", phrases) })
        } finally {
            setSubmit({ ...submit, isLoading: false} )
        }
        
    }

    const keys = {
        submit: "submitDefault",
    }

    const formClass = `personal-info form ${isLoadingState ? 'loading0' : ''}`
    const titleClass = `title ${isLoadingState || !phrases ? 'loading0' : ''}`
    const noteClass = `note ${note.type}`
    const fieldsClass = `fields ${isLoadingState || !phrases ? 'loading1' : ''}`
    const footerClass = `footer ${isLoadingState || !phrases ? 'loading1' : ''}`
    
    return (<>
        <Header />
        <form className={formClass}>
            <h2 className={titleClass}>{utilService.getPhrase('user_personal_details', phrases)}</h2>
            <article className={fieldsClass}>
                <UserPersonalInfo personalInfo={personalInfo} onChange={handleValueChanged} onSubmit={handleSubmit} />
                <div className={noteClass}>{note.text}</div>
                <FormField type={"BUTTON_SUBMIT"} key={keys.submit} params={submit} onPress={handleSubmit} />
            </article>
            <article className={footerClass}></article>
        </form>
        <Footer />
    </>)
}
