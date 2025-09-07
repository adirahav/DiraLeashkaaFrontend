import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { signup, updateUser } from '../store/actions/user.actions.js'
import { utilService } from '../services/util.service.js'
import { FormField } from '../cmps/FormField.jsx'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserPersonalInfo } from '../cmps/UserPersonalInfo.jsx'
import { UserFinancialDetails } from '../cmps/UserFinancialDetails.jsx'
import { UserTermsOfUse } from '../cmps/UserTermsOfUse.jsx'
import { logService } from '../services/log.service.js'
import { useSplash } from "../contexts/SplashContext"
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { Footer } from '../cmps/Footer.jsx'
import { Header } from '../cmps/Header.jsx'
//import promoImage1 from '../assets/images/promo-1.png'
//import promoImage2 from '../assets/images/promo-2.png'
//import promoImage3 from '../assets/images/promo-3.png'
//import promoImage4 from '../assets/images/promo-4.png'

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
            value: value !== null && value !== undefined,
            error: utilService.getPhrase(errorKey, phrases),
            enable: true
        }
    }

    const [personalInfo, setPersonalInfo] = useState({
        name: defultInputState("name", "signup_fullname_label", loggedinUser?.fullname, "signup_fullname_error"),
        email: defultInputState("email", "signup_email_label", loggedinUser?.email, "signup_email_error"),
        password: defultInputState("password", "signup_password_label", loggedinUser ? "********" : "", "signup_password_error"),
        yearOfBirth: defultInputState("yearOfBirth", "signup_year_of_birth_hint", loggedinUser?.yearOfBirth, "signup_year_of_birth_error", "signup_year_of_birth_tooltip", YEAR_OF_BIRTH_MAX_LENGTH)
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
     
    /*const PROMO_IMAGES_SIZE = 4
    const [promo, setPromo] = useState({
        currentIndex: 1,
        prevIndex: null,
        items: [
            { display: 'show', img: promoImage1, text: 'הדירות שלך, מסודרות לפי עיר – לראות את התמונה הגדולה בקלות.' },
            { display: 'hidden', img: promoImage2, text: 'איזו דירה עשויה להניב הכי הרבה? מבוסס על נתונים והערכות עדכניות.' },
            { display: 'hidden', img: promoImage3, text: 'חשב את מחיר הדירה המקסימלי שתוכל לרכוש.' },
            { display: 'hidden', img: promoImage4, text: 'התרחיש המשוער של צמיחת ההשקעה שלך לאורך השנים.' },
        ],
        animation: false
    })*/
    
    /*useEffect(() => {
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

        // promo
        //const intervalId = setInterval(() => {
        //    setPromo((prevPromo) => ({
        //        ...prevPromo,
        //        prevIndex: prevPromo.currentIndex,
        //        currentIndex: prevPromo.currentIndex == PROMO_IMAGES_SIZE ? 1 : prevPromo.currentIndex + 1
        //    }))
        //}, 4000)
    
        //return () => clearInterval(intervalId)
    }, [])*/

    const shouldJumpToStep = useCallback(() => {
        if (!loggedinUser || !loggedinUser.fullname || !loggedinUser.email || !loggedinUser.yearOfBirth) {
            return STEP.PRESONAL_INFO
        } else if (!loggedinUser.equity || !loggedinUser.incomes || !loggedinUser.commitments) {
            return STEP.FINANCIAL_DETAILS
        } else if (!loggedinUser.termsOfUseAccept) {
            return STEP.TERMS_OF_USE
        } else {
            return null
        }
    }, [loggedinUser])

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

        /*// promo
        const intervalId = setInterval(() => {
            setPromo((prevPromo) => ({
                ...prevPromo,
                prevIndex: prevPromo.currentIndex,
                currentIndex: prevPromo.currentIndex == PROMO_IMAGES_SIZE ? 1 : prevPromo.currentIndex + 1
            }))
        }, 4000)
    
        return () => clearInterval(intervalId)*/
    }, [])

    /*useEffect(() => {
        setPromo((prevPromo) => ({
            ...prevPromo,
            items: prevPromo.items.map((item, index) => ({
              ...item,
              display: prevPromo.currentIndex === index + 1 
                    ? 'show' 
                    : prevPromo.animation && prevPromo.prevIndex === index + 1 ? 'hide' : 'hidden',
            })),
            animation: true
          }))
    }, [promo.currentIndex])*/

    useEffect(() => {
        if (phrases) {
            setPersonalInfo({
                name: defultInputState("name", "signup_fullname_label", loggedinUser?.fullname, "signup_fullname_error"),
                email: defultInputState("email", "signup_email_label", loggedinUser?.email, "signup_email_error"),
                password: defultInputState("password", "signup_password_label", loggedinUser ? "********" : "", "signup_password_error"),
                yearOfBirth: defultInputState("yearOfBirth", "signup_year_of_birth_hint", loggedinUser?.yearOfBirth, "signup_year_of_birth_error", "signup_year_of_birth_tooltip", YEAR_OF_BIRTH_MAX_LENGTH)
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
    }, [splash])

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
                /*isBackDisabled = true
                isNextDisabled = true
                stepFields = {
                    ...termsOfUse,
                    accept: {...termsOfUse.accept, enable: false}
                }*/
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
            "equity": details.equity ? utilService.parseNumber(details.equity.value) : loggedinUser?.equity, 
            "incomes": details.incomes ? utilService.parseNumber(details.incomes.value) : loggedinUser?.incomes,  
            "commitments": details.commitments ? utilService.parseNumber(details.commitments.value) : loggedinUser?.commitments,   
            "termsOfUseAccept": details.accept ? details.accept.value : loggedinUser?.termsOfUseAccept, 
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
                        back: { ...prevButtons.back, isDisabled: true },
                        next: { ...prevButtons.next, isLoading: true, isDisabled: true },
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

    //const programs = utilService.getFixedParameter("payPrograms", fixedParameters)
    
    const formClass = `signup ${(Object.keys(STEP).find(key => STEP[key] === progress.step) || Object.keys(STEP)[0]).toLowerCase()}`
    const titleClass = `title ${isLoadingState || !phrases ? 'loading1' : ''}`
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
            <section className='form-container'>
                <h2 className={titleClass}>{stepTitle}</h2>
                <ul className={progressClass}>
                    <li className={progressLiClass[0]}></li>
                    <li className={progressLiClass[1]}></li>
                    <li className={progressLiClass[2]}></li>
                </ul>
                <article className={articleClass}>
                    {progress.step === STEP.PRESONAL_INFO && <UserPersonalInfo personalInfo={personalInfo} onChange={handleValueChanged} onSubmit={handleNext} />}
                    {progress.step === STEP.FINANCIAL_DETAILS && <UserFinancialDetails financialDetails={financialDetails} onChange={handleValueChanged} onSubmit={handleNext} />}
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
            </section>
            {/*<section className='promo'>
                {promo.currentIndex > 0 && (
                    <div>
                        {promo.items.map((item, index) => (
                            <article key={index} className={item.display}>
                                <p>{item.text}</p><img src={item.img} alt=''  />
                            </article>
                        ))}
                    </div>
                )}
            </section>*/}
        </form>
        <Footer />
    </>)
}
