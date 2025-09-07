import { useEffect, useState } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { useSelector } from 'react-redux'
import { utilService } from '../services/util.service'
import { FormField } from '../cmps/FormField'
import { logService } from '../services/log.service'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { useSplash } from "../contexts/SplashContext"
import { contactUsService } from '../services/contactus.service.js'

export function ContactUsPage() {

    const TAG = "PersonalInfoPage"
    
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    const defultDropdownState = (name, labelKey, options, errorKey) => {
        return {
            name,
            label: utilService.getPhrase(labelKey, phrases),
            options, 
            error: utilService.getPhrase(errorKey, phrases), 
            hasError: false
        }
    }

    const defultInputState = (name, labelKey, errorKey) => {
        return {
            name,
            label: utilService.getPhrase(labelKey, phrases), 
            error: utilService.getPhrase(errorKey, phrases), 
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

    const [contactUs, setContactUs] = useState({
        subject: defultDropdownState("name", "contactus_message_type_hint", null, "contactus_message_type_error"),
        message: defultInputState("email", "contactus_message_hint", "contactus_message_error")
    })

    const [note, setNote] = useState({text: null, type: "error"})
    const [submit, setSubmit] = useState(defultButtonState("button_send"))

    useEffect(() => {
        if (!phrases) {
            onLoadingStart()  
        } else {
            setSubmit(prevSubmit => ({...prevSubmit, text: utilService.getPhrase("button_send", phrases)}))
            onLoadingDone()  
        }
        
    }, [phrases])

    useEffect(() => {
        const options = fixedParameters
                            ? JSON.parse(fixedParameters.contactus)?.message_types
                            : null

        setContactUs((prevContactUs) => {
            return { 
                ...prevContactUs, 
                subject: { 
                    ...contactUs.subject, 
                    options 
                } 
            }
        })                             
    }, [fixedParameters])
    
    useEffect(() => {
        if (contactUs) {
            let hasError = false

            Object.entries(contactUs).forEach(([fieldValue]) => {
                if (fieldValue.value === undefined && fieldValue.hasError === undefined) {
                    return
                }
                if (!fieldValue.value || fieldValue.hasError) {
                    hasError = true
                }
            })

            setSubmit(prevSubmit => ({ ...prevSubmit, isDisabled: hasError }))
        }
    }, [contactUs])

    function handleValueChanged(fieldName, value, hasError) {
        setContactUs((prevContactUs) => {
            return { ...prevContactUs, [fieldName]: {...prevContactUs[fieldName], value, hasError} }
        })
        setNote(prevNote => ({ ...prevNote, text: null }))
    }

    const handleSubmit = async (event) => {
        
        event?.preventDefault()
        
        if (submit.isLoading || submit.isDisabled) {
            return
        }

        const messageToSend = {
            "subject": contactUs.subject.options.find(option => option.key === contactUs.subject.value).value,  
            "message": contactUs.message.value
        }
        
        try {
            setNote(prevNote => ({ ...prevNote, text: null }))
            setSubmit(prevSubmit => ({ ...prevSubmit, isLoading: true }))
        
            await contactUsService.send(messageToSend)
            setNote(prevNote => ({ ...prevNote, type: "message", text: utilService.getPhrase("contactus_message_send_success", phrases)}))
            
            setContactUs((prevContactUs) => {
                return { 
                    ...prevContactUs, 
                    subject: { 
                        ...contactUs.subject, 
                        value: null,
                        selectedValue: 0 
                    },
                    message: { 
                        ...contactUs.message, 
                        value: null 
                    }
                }
            }) 
        } catch(error) {
            logService.error(TAG, error)
            setNote(prevNote => ({ ...prevNote, type: "error", text: utilService.getPhrase("dialog_data_error_title", phrases) }))
        } finally {
            setSubmit(prevSubmit => ({ ...prevSubmit, isLoading: false }))
        }
        
    }

    const keys = {
        subject: "subject" + (contactUs.name ? contactUs.subject : "Default"),
        message: "message" + (contactUs.message ? contactUs.message : "Default"),
        submit: "submitDefault",
    }

    const formClass = `contact-us form ${isLoadingState ? 'loading0' : ''}`
    const titleClass = `title ${isLoadingState || !phrases ? 'loading0' : ''}`
    const noteClass = `note ${note.type}`
    const articleClass = `fields ${isLoadingState || !phrases ? 'loading1' : ''}`
    
    return (<>
        <Header />
        <form className={formClass}>
            <h2 className={titleClass}>{utilService.getPhrase('actionbar_title_contact_us', phrases)}</h2>
            <article className={articleClass}>
                <FormField type={"DROP_DOWN"} key={keys.subject} params={contactUs.subject} onChange={(value, hasError) => handleValueChanged('subject', value, hasError)} />
                <FormField type={"TEXT_AREA"} key={keys.message} params={contactUs.message} onChange={(value, hasError) => handleValueChanged('message', value, hasError)} onEnter={handleSubmit} />
                <div className={noteClass}>{note.text}</div>
                <FormField type={"BUTTON_SUBMIT"} key={keys.submit} params={submit} onPress={handleSubmit} />
            </article>
        </form>
        <Footer />
    </>)
}
