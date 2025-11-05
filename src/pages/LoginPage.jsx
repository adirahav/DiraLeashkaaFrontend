import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { login } from '../store/actions/user.actions.js'
import { authService } from '../services/auth.service.js'
import { utilService } from '../services/util.service.js'
import { FormField } from '../cmps/FormField.jsx'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSplash } from "../contexts/SplashContext"
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { Footer } from '../cmps/Footer.jsx'
import { Header } from '../cmps/Header.jsx'

export function LoginPage() {
    const [error, setError] = useState(null)
    
    const { splash, setForceFetchSplash } = useSplash()
    const phrases = splash?.phrases

    const navigate = useNavigate()

    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const isLoggedinUserCompleted = useSelector(storeState => storeState.userModule.isLoggedinUserCompleted)
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const defultInputState = (name, labelKey, value) => {
        return {
            name,
            label: utilService.getPhrase(labelKey, phrases), 
            value
        }
    }

    const defultButtonState = (textKey) => {
        return {
            text: utilService.getPhrase(textKey, phrases), 
            isDisabled: true,
            isLoading: false
        }
    }

    const [email, setEmail] = useState(defultInputState("email", "login_email_label", ""))
    const [password, setPassword] = useState(defultInputState("password", "login_password_label", ""))
    const [submit, setSubmit] = useState(defultButtonState("login_submit"))
    
    useEffect(() => {
        if (loggedinUser && isLoggedinUserCompleted) {
            navigate(`/home`)
        }

        authService.getLastLoggedinEmail().then((reponse) => {
            setEmail(email => ({ ...email, value: reponse }))
        }).catch((reasone) => {})
        
    }, [])

    useEffect(() => {
        setSubmit(submit => ({ ...submit, isDisabled: !utilService.REG_EXP.EMAIL.test(email.value) || !utilService.REG_EXP.PASSWORD.test(password.value) }))
    }, [email, password])

    useEffect(() => {
        if (phrases) {
            setEmail(email => ({ ...email, label: utilService.getPhrase("login_email_label", phrases) }))
            setPassword(password => ({ ...password, label: utilService.getPhrase("login_password_label", phrases) }))
            setSubmit(submit => ({ ...submit, label: utilService.getPhrase("login_submit", phrases) }))
        }

        if (!phrases) {
            onLoadingStart()  
        } else {
            onLoadingDone()  
        }
    }, [phrases])

    function handleValueChanged(fieldName, value) {
        switch (fieldName) {
            case "email":
                setEmail(email => ({ ...email, value }))
                break
            case "password":
                setPassword(password => ({ ...password, value }))
                break
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (submit.isLoading || submit.isDisabled) {
            return
        }

        try {
            setError(null)
            setSubmit({ 
                ...submit, 
                isLoading: true
            })
            
            await login(email.value, password.value)
            
            setForceFetchSplash(true)
            
            navigate(isLoggedinUserCompleted ? `/home` : `/signup`)

        } catch (error) {
            setError(utilService.getPhrase("login_credentials_error", phrases))
        } finally {
            setSubmit({ 
                ...submit, 
                isLoading: false
            })
        } 

    }

    const keys = {
        email: "email" + (email ? email : "Default"),
        password: "password" + (password ? password : "Default"),
        submit: "submit" + ("Default"),
    }
    
    const formClass = `login form ${isLoadingState?'loading': ''}`
    const titleClass = `title ${isLoadingState || !phrases ? 'loading0' : ''}`
    const articleClass = `fields ${isLoadingState || !phrases ? 'loading1' : ''}`
    const footerClass = `footer ${isLoadingState || !phrases ? 'loading2' : ''}`

    return (<>
        <Header />
        <form className={formClass}>
            <h2 className={titleClass}>{utilService.getPhrase('login_header', phrases)}</h2>
            <article className={articleClass}>
                <FormField type={"EMAIL"} key={keys.email} params={email} onChange={(value) => handleValueChanged('email', value)} />
                <FormField type={"PASSWORD"} key={keys.password} params={password} onChange={(value) => handleValueChanged('password', value)} onEnter={handleSubmit} />
                <div className='error'>{error}</div>
                <FormField type={"BUTTON_SUBMIT"} key={keys.submit} params={submit} onPress={handleSubmit} />
            </article>
            <article className={footerClass}>
                <div><NavLink to='/signup' dangerouslySetInnerHTML={{ __html: utilService.getPhrase("login_goto_signup", phrases) }}></NavLink></div>
                <div><NavLink to='/forgot-password' dangerouslySetInnerHTML={{ __html: utilService.getPhrase("forgot_password_link", phrases) }}></NavLink></div>
            </article>
        </form>
        <Footer />
    </>
    )
}
