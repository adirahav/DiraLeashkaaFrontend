import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { signup, updateUser, login } from '../store/actions/user.actions.js'
import { utilService } from '../services/util.service.js'
import { FormField } from '../cmps/FormField.jsx'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserPersonalInfo } from '../cmps/UserPersonalInfo.jsx'
import { UserFinancialDetails } from '../cmps/UserFinancialDetails.jsx'
import { FinancialDetailsIcon, IconSizes, PersonalDetailsIcon, ProgramIcon, TermsOfUseIcon, WelcomeIcon } from '../assets/icons.jsx'
import { UserTermsOfUse } from '../cmps/UserTermsOfUse.jsx'
import { SignupWelcome } from '../cmps/SignupWelcome.jsx'
import { logService } from '../services/log.service.js'
import { useSplash } from '../contexts/SplashContext.jsx'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'

export function SignUpPage() {
    const TAG = 'SignUpPage'

    const STEP = {
        PRESONAL_INFO: 1,
        FINANCIAL_DETAILS: 2,
        TERMS_OF_USE: 3,
        //PROGRAMS: 4,
        WELCOME: 4
    }

    const YEAR_OF_BIRTH_MAX_LENGTH = 4

    const [step, setStep] = useState(null)
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    
    const navigate = useNavigate()
    
    const { splash, setForceFetchSplash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
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

    const defultProgramState = (name) => {
        return {
            name,
            value: ""
        }
    }

    const defultButtonState = (textKey) => {
        return {
            text: utilService.getPhrase(textKey, phrases), 
            isDisabled: true,
            isLoading: false
        }
    }

    const defultTextAreaState = (textKey) => {
        return utilService.getPhrase(textKey, phrases)
    }

    const defultCheckboxState = (name, labelKey, value, errorKey) => {
        return {
            name,
            label: utilService.getPhrase(labelKey, phrases), 
            value: value || false,
            error: utilService.getPhrase(errorKey, phrases)
        }
    }


    const [personalInfo, setPersonalInfo] = useState({
        name: defultInputState("name", "signup_fullname_label", loggedinUser?.fullname, "signup_fullname_error"),
        email: defultInputState("email", "signup_email_label", loggedinUser?.email, "signup_email_error"),
        password: defultInputState("password", "signup_password_label", loggedinUser ? "********" : "", "signup_password_error"),
        yearOfBirth: defultInputState("yearOfBirth", "signup_year_of_birth_hint", loggedinUser?.yearOfBirth, "signup_year_of_birth_error", null, YEAR_OF_BIRTH_MAX_LENGTH)
    })

    const [financialDetails, setFinancialDetails ] = useState({
        equity: defultInputState("equity", "signup_equity_label", loggedinUser?.equity, "signup_equity_error", "signup_equity_tooltip"),
        incomes: defultInputState("incomes", "signup_incomes_label", loggedinUser?.incomes, "signup_incomes_error", "signup_incomes_tooltip"),
        commitments: defultInputState("commitments", "signup_commitments_label", loggedinUser?.commitments, "signup_commitments_error", "signup_commitments_tooltip")
    })

    const [termsOfUse, setTermsOfUse] = useState({ 
        text: defultTextAreaState("signup_terms_of_use_text"),
        accept: defultCheckboxState("accept", "signup_terms_of_use_agree", loggedinUser?.termsOfUseAccept, "signup_terms_of_use_agree_error")
    })

    const [program, setProgram] = useState({ 
        selectedProgram: defultProgramState("selectedProgram")
    })
    
    const [buttons, setButtons] = useState({
        next: defultButtonState("button_next"),
        back: defultButtonState("button_back"),
    })
     
    useEffect(() => {
        const loadStep = jumpToStep()                       
        if (!loadStep) {
            navigate("/home")
        }
        else {
            setStep(loadStep)
        }
    }, [])

    useEffect(() => {
        if (phrases) {
            setPersonalInfo({
                name: defultInputState("name", "signup_fullname_label", loggedinUser?.fullname, "signup_fullname_error"),
                email: defultInputState("email", "signup_email_label", loggedinUser?.email, "signup_email_error"),
                password: defultInputState("password", "signup_password_label", loggedinUser ? "********" : "", "signup_password_error"),
                yearOfBirth: defultInputState("yearOfBirth", "signup_year_of_birth_hint", loggedinUser?.yearOfBirth, "signup_year_of_birth_error", null, YEAR_OF_BIRTH_MAX_LENGTH)
            })
        
            setFinancialDetails({
                equity: defultInputState("equity", "signup_equity_label", loggedinUser?.equity, "signup_equity_error", "signup_equity_tooltip"),
                incomes: defultInputState("incomes", "signup_incomes_label", loggedinUser?.incomes, "signup_incomes_error", "signup_incomes_tooltip"),
                commitments: defultInputState("commitments", "signup_commitments_label", loggedinUser?.commitments, "signup_commitments_error", "signup_commitments_tooltip")
            })
        
            setTermsOfUse({ 
                text: defultTextAreaState("signup_terms_of_use_text"),
                accept: defultCheckboxState("accept", "signup_terms_of_use_agree", loggedinUser?.termsOfUseAccept, "signup_terms_of_use_agree_error")
            })
        
            setProgram({ 
                selectedProgram: defultProgramState("selectedProgram")
            })
            
            setButtons({
                next: defultButtonState("button_next"),
                back: defultButtonState("button_back"),
            })
        }

        if (!phrases) {
            onLoadingStart()  
        } else {
            onLoadingDone()  
        }
    }, [phrases])

    function jumpToStep() {
        if (!loggedinUser || !loggedinUser.fullname || !loggedinUser.email || !loggedinUser.yearOfBirth) {
            return STEP.PRESONAL_INFO
        } else if (!loggedinUser.equity || !loggedinUser.incomes || !loggedinUser.commitments) {
            return STEP.FINANCIAL_DETAILS
        } else if (!loggedinUser.termsOfUseAccept) {
            return STEP.WELCOME
        } else {
            return null
        }
    }

    function handleValueChanged(fieldName, value, hasError) {
        switch (fieldName) {
             // STEP 1
            case "name":
            case "email":
            case "password":
            case "yearOfBirth":
                setPersonalInfo((prevPersonalInfo) => {
                    return { ...prevPersonalInfo, [fieldName]: {...prevPersonalInfo[fieldName], value, hasError} }
                })
                break

            // STEP 2
            case "equity":
            case "incomes":
            case "commitments":
                setFinancialDetails((prevFinancialDetails) => {
                    return { ...prevFinancialDetails, [fieldName]: {...prevFinancialDetails[fieldName], value, hasError} }
                })
                break
                
            // STEP 3
            case "accept":
                setTermsOfUse((prevTermsOfUse) => {
                    return { ...prevTermsOfUse, [fieldName]: {...prevTermsOfUse[fieldName], value} }
                })
                break
            
            // STEP 4
            /*case "selectedProgram":
                setProgram((prevProgram) => {
                    return { ...prevProgram, [fieldName]: {...prevProgram[fieldName], value, hasError} }
                })
                break*/

            // STEP 4
           
        }

        
    }

    function handleOnComplete() {
        setForceFetchSplash(true)
        navigate("/home")
    }

    useEffect(() => {
        handleEnableButton()
    }, [step, personalInfo, financialDetails, termsOfUse, program])
    
    const handleEnableButton = () => {
        if (!step) {
            return
        }

        let stepFields
        let isBackDisabled = true
        let isNextDisabled = true
        let hasError = false
          
        switch (step) {
            case STEP.PRESONAL_INFO:
                isBackDisabled = true
                stepFields = personalInfo
                break
            case STEP.FINANCIAL_DETAILS:
                isBackDisabled = false
                stepFields = financialDetails
                break
            case STEP.TERMS_OF_USE:
                isBackDisabled = false
                stepFields = termsOfUse
                break
            case STEP.PROGRAMS:
                isBackDisabled = false
                stepFields = program
                break
            case STEP.PROGRAMS:
                isBackDisabled = false
                isNextDisabled = false
                break
        }

        if (stepFields) {
            Object.entries(stepFields).forEach(([fieldName, fieldValue]) => {
                if (fieldValue.value === undefined && fieldValue.hasError === undefined) {
                    return
                }
                if (!fieldValue.value || fieldValue.hasError) {
                    hasError = true
                }
            })

            isNextDisabled = !step || hasError
        }
        
        

        setButtons((prevButtons) => ({
            back: { ...prevButtons.back, isDisabled: isBackDisabled },
            next: { ...prevButtons.next, isDisabled: isNextDisabled },
        }))
    }

    async function saveUser(details) {
        const userToSave = {
            "email": details.email ? details.email.value : loggedinUser?.email,
            "password": details.password ? details.password.value : loggedinUser?.password, 
            "fullname": details.name ? details.name.value : loggedinUser?.fullname,  
            "yearOfBirth": details.yearOfBirth ? details.yearOfBirth.value : loggedinUser?.yearOfBirth,
            "equity": details.equity ? details.equity.value : loggedinUser?.equity, 
            "incomes": details.incomes ? details.incomes.value : loggedinUser?.incomes,  
            "commitments": details.commitments ? details.commitments.value : loggedinUser?.commitments,   
            "termsOfUseAccept": details.termsOfUseAccept ? details.termsOfUseAccept.value : loggedinUser?.termsOfUseAccept, 
            "webDeviceType": window.navigator.userAgent
        }

        if (!loggedinUser) {
            await signup(userToSave)
        } else {
            delete userToSave.email
            delete userToSave.password 
            await updateUser(userToSave)
        }
        
    }
    
    const handleNext = async (event) => {
        switch (step) {
            case STEP.PRESONAL_INFO:
                try {
                    setButtons((prevButtons) => ({
                        ...prevButtons,
                        next: { ...prevButtons.next, isLoading: true },
                    }))

                    await saveUser(personalInfo)

                    setStep((prevStep) => {
                        return prevStep + 1 
                    })
                } catch(e) {
                    if (e?.response?.status === 400 && e?.response?.data === "Failed to signup: Email already taken") {
                        setPersonalInfo((prevPersonalInfo) => {
                            return { 
                                ...prevPersonalInfo, 
                                "email": {
                                    ...prevPersonalInfo.email, 
                                    error: utilService.getPhrase("signup_email_taken_error", phrases), 
                                    hasError: true
                                } 
                            }
                        })
                    }
                    else {
                        logService.error(TAG, e)
                    }  
                } finally {
                    setButtons((prevButtons) => ({
                        ...prevButtons,
                        next: { ...prevButtons.next, isLoading: false },
                    }))
                }
                break
            case STEP.FINANCIAL_DETAILS:
                try {
                    setButtons((prevButtons) => ({
                        ...prevButtons,
                        next: { ...prevButtons.next, isLoading: true },
                    }))

                    await saveUser(financialDetails)
                    
                    setStep((prevStep) => {
                        return prevStep + 1 
                    })
                } catch(e) {
                    logService.error(TAG, e)
                } finally {
                    setButtons((prevButtons) => ({
                        ...prevButtons,
                        next: { ...prevButtons.next, isLoading: false },
                    }))
                }
                break
            case STEP.TERMS_OF_USE:
                try {
                    setButtons((prevButtons) => ({
                        ...prevButtons,
                        next: { ...prevButtons.next, isLoading: true },
                    }))

                    await saveUser(termsOfUse)
                    
                    setStep((prevStep) => {
                        return prevStep + 1 
                    })
                } catch(e) {
                    logService.error(TAG, e)
                } finally {
                    setButtons((prevButtons) => ({
                        ...prevButtons,
                        next: { ...prevButtons.next, isLoading: false },
                    }))
                }
                break
            case STEP.WELCOME:
                break

        }

        event.preventDefault()

        /*if (submit.isLoading || submit.isDisabled) {
            return
        }

        try {
            setError(null)
            setSubmit({ 
                ...submit, 
                isLoading: true
            })
            const loggedinUser = await authService.login(email.value, password.value)
            userService.saveLocalUser(loggedinUser)

            await userService.splash()
           
            navigate(`/home`)
        } catch (error) {
            setError(utilService.getPhrase("login_credentials_error", phrases))
        } finally {
            setSubmit({ 
                ...submit, 
                isLoading: false
            })
        } */

    }

    const handleBack = async (event) => {
        setStep((prevStep) => {
            return prevStep - 1 
        })

        event.preventDefault()
    }

    const keys = {
        next: "next",
        back: "back",
        generalError: "generalError"
    }

    const programs = utilService.getFixedParameter("array", "payPrograms", fixedParameters)
    
    const formClass = `signup ${(Object.keys(STEP).find(key => STEP[key] === step) || Object.keys(STEP)[0]).toLowerCase()}`
    const titleClass = `title ${isLoadingState || !phrases ? 'loading0' : ''}`
    const menuClass = `menu ${isLoadingState || !phrases ? 'loading1' : ''}`
    const articleClass = `form ${isLoadingState || !phrases ? 'loading1' : ''}`
    const footerClass = `footer ${isLoadingState || !phrases ? 'loading2' : ''}`
    
    return (
        <form className={formClass}>
            <h2 className={titleClass}>{!isLoadingState && utilService.getPhrase('login_header', phrases)}</h2>
            <ul className={menuClass}>
                <li className={step===STEP.PRESONAL_INFO?'active':''}><PersonalDetailsIcon sx={IconSizes.Small} /><span>פרטים אישיים</span></li>
                <li className={step===STEP.FINANCIAL_DETAILS?'active':''}><FinancialDetailsIcon sx={IconSizes.Small} /><span>נתונים כלכליים</span></li>
                <li className={step===STEP.TERMS_OF_USE?'active':''}><TermsOfUseIcon sx={IconSizes.Small} /><span>תנאי שימוש</span></li>
                <li className={step===STEP.WELCOME?'active':''}><WelcomeIcon sx={IconSizes.Small} /><span>סיום</span></li>
            </ul>
            <article className={articleClass}>
                {step === STEP.PRESONAL_INFO && <UserPersonalInfo personalInfo={personalInfo} onChange={handleValueChanged} />}
                {step === STEP.FINANCIAL_DETAILS && <UserFinancialDetails financialDetails={financialDetails} onChange={handleValueChanged} />}
                {step === STEP.TERMS_OF_USE && <UserTermsOfUse termsOfUse={termsOfUse} onChange={handleValueChanged} />}
                {/*step === STEP.PROGRAMS && programs && programs.isAvailable && <UserPrograms programs={programs} onChange={handleValueChanged} />*/}
                {step === STEP.WELCOME && <SignupWelcome onComplete={handleOnComplete} />}
                
                {step !== STEP.WELCOME && <div className='buttons'>
                    <FormField type={"BUTTON"} key={keys.back} params={buttons.back} onPress={handleBack} />
                    <FormField type={"BUTTON"} key={keys.next} params={buttons.next} onPress={handleNext} />
                </div>}   
            </article>
            <article className={footerClass}>
                <div><NavLink to='/login' dangerouslySetInnerHTML={{ __html: utilService.getPhrase("signup_goto_login", phrases) }}></NavLink></div>
            </article>
        </form>
    )
}
