import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { signup, updateUser, login } from '../store/actions/user.actions.js'
import { utilService } from '../services/util.service.js'
import { FormField } from '../cmps/FormField.jsx'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserPersonalInfo } from '../cmps/UserPersonalInfo.jsx'
import { UserFinancialDetails } from '../cmps/UserFinancialDetails.jsx'
import { FinancialDetailsIcon, IconSizes, PersonalDetailsIcon, ProgramIcon, TermsOfUseIcon } from '../assets/icons.jsx'
import { UserTermsOfUse } from '../cmps/UserTermsOfUse.jsx'
import { logService } from '../services/log.service.js'
import { useSplash } from '../contexts/SplashContext.jsx'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { Footer } from '../cmps/Footer.jsx'
import { Header } from '../cmps/Header.jsx'

export function SignUpPage() {
    const TAG = 'SignUpPage'

    const STEP = {
        PRESONAL_INFO: 1,
        FINANCIAL_DETAILS: 2,
        TERMS_OF_USE: 3,
        COMPLETE: 4
    }

    const YEAR_OF_BIRTH_MAX_LENGTH = 4

    const [progress, setProgress] = useState({
        step: null,
        direction: null
    })
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
            error: utilService.getPhrase(errorKey, phrases),
            enable: true
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
            setProgress({
                step: loadStep,
                direction: 'forward'
            })
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
            return STEP.TERMS_OF_USE
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
        }

        
    }

    function handleOnComplete() {
        setForceFetchSplash(true)

        setTimeout(() => {
            navigate("/home")
        }, 1200)
    }

    useEffect(() => {
        handleEnableButton()
    }, [progress.step, personalInfo, financialDetails, termsOfUse, program])
    
    const handleEnableButton = () => {
        if (!progress.step) {
            return
        }

        let stepFields
        let isBackDisabled = true
        let isNextDisabled = true
        let hasError = false
          
        switch (progress.step) {
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
            case STEP.COMPLETE:
                isBackDisabled = false
                isNextDisabled = false
                stepFields = {
                    ...termsOfUse,
                    accept: {...termsOfUse.accept, enable: false}
                }
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

            isNextDisabled = !progress.step || hasError
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
        switch (progress.step) {
            case STEP.PRESONAL_INFO:
                try {
                    setButtons((prevButtons) => ({
                        ...prevButtons,
                        back: { ...prevButtons.back, isDisabled: true },
                        next: { ...prevButtons.next, isLoading: true },
                    }))

                    await saveUser(personalInfo)

                    setProgress((prevProgress) => {
                        return {
                            step: prevProgress.step + 1 ,
                            direction: 'forward'
                        } 
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
                    
                    setProgress((prevProgress) => {
                        return {
                            step: prevProgress.step + 1 ,
                            direction: 'forward'
                        } 
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
                    
                    setProgress((prevProgress) => {
                        return {
                            step: prevProgress.step + 1 ,
                            direction: 'forward'
                        } 
                    })

                    handleOnComplete()
                } catch(e) {
                    logService.error(TAG, e)
                } finally {
                    setButtons((prevButtons) => ({
                        back: { ...prevButtons.back, isLoading: false, isDisabled: true },
                        next: { ...prevButtons.next, isLoading: false, isDisabled: true },
                    }))
                }
                break

        }

        event.preventDefault()
    }

    const handleBack = async (event) => {
        setProgress((prevProgress) => {
            return {
                step: prevProgress.step - 1 ,
                direction: 'backward'
            } 
        })

        event.preventDefault()
    }

    const keys = {
        next: "next",
        back: "back",
        generalError: "generalError"
    }

    const programs = utilService.getFixedParameter("payPrograms", fixedParameters)
    
    const formClass = `signup ${(Object.keys(STEP).find(key => STEP[key] === progress.step) || Object.keys(STEP)[0]).toLowerCase()}`
    const titleClass = `title ${isLoadingState || !phrases ? 'loading0' : ''}`
    const progressClass = `progress ${isLoadingState || !phrases ? 'loading1' : ''}`
    const articleClass = `form ${isLoadingState || !phrases ? 'loading1' : ''}`
    const footerClass = `footer ${isLoadingState || !phrases ? 'loading1' : ''}`
    
    const stepTitle = progress.step === STEP.PRESONAL_INFO ? "פרטים אישיים" :
    progress.step === STEP.FINANCIAL_DETAILS ? "נתונים כלכליים" :
                      progress.step === STEP.TERMS_OF_USE ? "תנאי שימוש" : ""

    const setProgressClass = (currentStep) => {
        if (progress.step === currentStep + 1 && progress.direction === "forward" || progress.step === currentStep && progress.direction === "backward") {
            return progress.direction
        } else if (progress.step === currentStep && progress.direction === "backward" || progress.step > currentStep) {
            return 'active'
        } else {
            return ''
        }
    }

    const progressLiClass = [
        setProgressClass(STEP.PRESONAL_INFO),
        setProgressClass(STEP.FINANCIAL_DETAILS),
        setProgressClass(STEP.TERMS_OF_USE)
    ]

    return (<>
        <Header />
        <form className={formClass}>
            <h2 className={titleClass}>{stepTitle}</h2>
            <ul className={progressClass}>
                <li className={progressLiClass[0]}></li>
                <li className={progressLiClass[1]}></li>
                <li className={progressLiClass[2]}></li>
            </ul>
            <article className={articleClass}>
                {progress.step === STEP.PRESONAL_INFO && <UserPersonalInfo personalInfo={personalInfo} onChange={handleValueChanged} />}
                {progress.step === STEP.FINANCIAL_DETAILS && <UserFinancialDetails financialDetails={financialDetails} onChange={handleValueChanged} />}
                {progress.step === STEP.TERMS_OF_USE && <UserTermsOfUse termsOfUse={termsOfUse} onChange={handleValueChanged} />}
                {progress.step === STEP.COMPLETE && <UserTermsOfUse termsOfUse={termsOfUse} />}
                
                {<div className='buttons'>
                    <FormField type={"BUTTON"} key={keys.back} params={buttons.back} onPress={handleBack} />
                    <FormField type={"BUTTON"} key={keys.next} params={buttons.next} onPress={handleNext} />
                </div>}   
            </article>
            <article className={footerClass}>
                <div><NavLink to='/login' dangerouslySetInnerHTML={{ __html: utilService.getPhrase("signup_goto_login", phrases) }}></NavLink></div>
            </article>
        </form>
        <Footer />
    </>)
}
