import { useState, useEffect, useCallback } from 'react'
import { authService } from '../services/auth.service.js'
import { utilService } from '../services/util.service.js'
import { FormField } from '../cmps/FormField.jsx'
import { NavLink, useNavigate } from 'react-router-dom'
import { forgotPasswordService } from '../services/forgotPassword.service.js'
import { useSplash } from '../contexts/SplashContext.jsx'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { useSelector } from 'react-redux'
import { Header } from '../cmps/Header.jsx'
import { Footer } from '../cmps/Footer.jsx'

export function ForgotPasswordPage() {
    const TAG = 'ForgotPasswordPage'

    const STEP = {
        GENERATE_CODE: 1,
        VALIDATE_CODE: 2,
        CHANGE_PASSWORD: 3,
        DONE: 4,
    }

    const CODE_LENGTH = 4
    const AWAIT_AFTER_DONE = 3

    const { splash } = useSplash()
    const phrases = splash?.phrases

    const [note, setNote] = useState({text: null, type: "error"})
    const [step, setStep] = useState(STEP.GENERATE_CODE)
    
    const navigate = useNavigate()
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const defultInputState = (name, labelKey) => {
        return {
            name,
            label: utilService.getPhrase(labelKey, phrases), 
            value: ""
        }
    }

    const defultCodeState = (name, labelKey) => {
        return {
            name,
            label: utilService.getPhrase(labelKey, phrases), 
            value: Array(CODE_LENGTH).fill(''),
            length: CODE_LENGTH,
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

    const [email, setEmail] = useState(defultInputState("email", "forgot_password_email_label"))
    const [code, setCode] = useState(defultCodeState("code", "forgot_password_code_title"))
    const [newPassword, setNewPassword] = useState(defultInputState("newPassword", "forgot_password_new_password_label"))
    const [submit, setSubmit] = useState(defultButtonState("button_send"))
    
    useEffect(() => {
        setEmail({ ...email, value: authService.getLastLoggedinEmail() })  
    }, [])


    useEffect(() => {
        if (phrases) {
            setEmail({ ...email, label: utilService.getPhrase("forgot_password_email_label", phrases), value: authService.getLastLoggedinEmail()})
            setCode({ ...code, label: utilService.getPhrase("forgot_password_code_title", phrases)})
            setNewPassword({ ...newPassword, label: utilService.getPhrase("forgot_password_new_password_label", phrases)})
            setSubmit({ ...submit, text: utilService.getPhrase("button_send", phrases)})
        }

        if (!phrases) {
            onLoadingStart()  
        } else {
            onLoadingDone()  
        }
    }, [phrases])

    useEffect(() => {
        if (step === STEP.GENERATE_CODE) {
            setSubmit({ 
                ...submit, 
                isDisabled: !utilService.REG_EXP.EMAIL.test(email.value)
            })
        }
    }, [email])

    useEffect(() => {
        if (step === STEP.CHANGE_PASSWORD) {
            setSubmit({ 
                ...submit, 
                isDisabled: !utilService.REG_EXP.PASSWORD.test(newPassword.value)
            })
        }
    }, [newPassword])

    useEffect(() => {
        if (step === STEP.VALIDATE_CODE) {
            handleCodeValidation()
        }
    }, [code.value])

    const handleCodeValidation = async () => {
        if (code.value.some(ch => ch === '')) {
            return
        }

        try {
            setNote({ ...note, text: null })
            await forgotPasswordService.validateCode(email.value, code.value.join(''))
            handleNext()
        }
        catch(e) {
            //e.response.status 400
            setNote({ ...note, text: utilService.getPhrase("forgot_password_code_error", phrases) })
        }
    }

    function handleValueChanged(fieldName, value) {
        switch (fieldName) {
            case "email":
                setEmail({ ...email, value })
                break
            case "code":
                setCode({ ...code, value })
                break
            case "newPassword":
                setNewPassword({ ...newPassword, value })
        }
    }

    const handleNext = () => {
        switch (step) {
            case STEP.GENERATE_CODE: 
                setStep(STEP.VALIDATE_CODE)
                break
            case STEP.VALIDATE_CODE: 
                setStep(STEP.CHANGE_PASSWORD)
                break
            case STEP.CHANGE_PASSWORD: 
                setStep(STEP.DONE)
                break
            case STEP.DONE: 
                break
        }
    } 

    const handleBack = () => {
        switch (step) {
            case STEP.GENERATE_CODE: 
                  break
            case STEP.VALIDATE_CODE: 
                setStep(STEP.GENERATE_CODE)
                break
            case STEP.CHANGE_PASSWORD: 
                setStep(STEP.VALIDATE_CODE)
                break
            case STEP.DONE: 
                setStep(STEP.CHANGE_PASSWORD)
                break
        }
    } 

    useEffect(() => {
        switch (step) {
            case STEP.GENERATE_CODE: 
                setSubmit({  ...submit, text: utilService.getPhrase("button_send", phrases), isVisible: true, isLinkView: false, isLoading: false })
                break
            case STEP.VALIDATE_CODE: 
                setSubmit({  ...submit, text: utilService.getPhrase("forgot_password_send_again", phrases), isLinkView: true, isLoading: false })
                break
            case STEP.CHANGE_PASSWORD: 
                setSubmit({  ...submit, text: utilService.getPhrase("button_change", phrases), isLinkView: false, isLoading: false, isDisabled: true })
                break
            case STEP.DONE: 
                setSubmit({  ...submit, isVisible: false })
                break
        }
    }, [step])

    const handleSubmit = async (event) => {
        event?.preventDefault()
        
        if (submit.isLoading || !submit.isVisible || submit.isDisabled) {
            return
        }

        switch (step) {
            case STEP.GENERATE_CODE: 
                try {
                    setNote({  ...note, text: null })
                    setSubmit({ ...submit, isLoading: true})
                    await forgotPasswordService.generateCode(email.value)
                    handleNext()
                } catch (error) {
                    setNote({  ...note, text: utilService.getPhrase("forgot_password_credentials_error", phrases) })
                    setSubmit({ ...submit, isLoading: false})
                } 
                break
            case STEP.VALIDATE_CODE: 
                setNote({  ...note, text: null })
                setCode(defultCodeState("code", "forgot_password_code_title"))
                handleBack()
                break
            case STEP.CHANGE_PASSWORD: 
                setNote({  ...note, text: null })
                setSubmit({ ...submit, isLoading: true})
                await forgotPasswordService.changePassword(newPassword.value)
                setNewPassword({ ...newPassword, isDisabled: true })
                setNote({  ...note, text: utilService.getPhrase("forgot_password_email_done_body", phrases), type: "message" })
                handleNext()
                setTimeout(()=> {
                    navigate(`/login`)
                }, AWAIT_AFTER_DONE * 1000)
                break
            case STEP.DONE: 
                break
        }

    }

    const keys = {
        email: "email" + (email ? email : "Default"),
        code: "codeDefault",
        newPassword: "newPasswordDefault",
        submit: "submitDefault",
    }

    const noteClass = `note ${note.type}`

    const formClass = `forgot-password form ${isLoadingState?'loading': ''}`
    const titleClass = `title ${isLoadingState || !phrases ? 'loading0' : ''}`
    const articleClass = `fields ${isLoadingState || !phrases ? 'loading1' : ''}`
    const footerClass = `footer ${isLoadingState || !phrases ? 'loading2' : ''}`

    return (<>
        <Header />
        <form className={formClass}>
            <h2 className={titleClass}>{utilService.getPhrase('forgot_password_header', phrases)}</h2>
            <article className={articleClass}>
                {step === STEP.GENERATE_CODE && <FormField type={"EMAIL"} key={keys.email} params={email} onChange={(value) => handleValueChanged('email', value)} onEnter={handleSubmit} />}
                {step === STEP.VALIDATE_CODE && <FormField type={"CODE"} key={keys.code} params={code} onChange={(value) => handleValueChanged('code', value)} />}
                {(step === STEP.CHANGE_PASSWORD || step === STEP.DONE) && <FormField type={"PASSWORD"} key={keys.newPassword} params={newPassword} onChange={(value) => handleValueChanged('newPassword', value)} onEnter={handleSubmit} />}
                <div className={noteClass}>{note.text}</div>
                {submit.isVisible && <FormField type={"BUTTON_SUBMIT"} key={keys.submit} params={submit} onPress={handleSubmit} />}
            </article>
           <article className={footerClass}>
                <div><NavLink to='/login' dangerouslySetInnerHTML={{ __html: utilService.getPhrase("forgot_password_goto_login", phrases) }}></NavLink></div>
            </article>
        </form>
        <Footer />
    </>)
}
