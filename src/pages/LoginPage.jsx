import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { login } from '../store/actions/user.actions.js'
import { authService } from '../services/auth.service.js'
import { utilService } from '../services/util.service.js'
import { FormField } from '../cmps/FormField.jsx'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSplash } from '../contexts/SplashContext.jsx'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'

export function LoginPage() {
    const [error, setError] = useState(null)
    
    const { splash, setForceFetchSplash } = useSplash()

    const navigate = useNavigate()

    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const defultInputState = (name, labelKey, value) => {
        return {
            name,
            label: utilService.getPhrase(labelKey, splash?.phrases), 
            value
        }
    }

    const defultButtonState = (textKey) => {
        return {
            text: utilService.getPhrase(textKey, splash?.phrases), 
            isDisabled: true,
            isLoading: false
        }
    }

    const [email, setEmail] = useState(defultInputState("email", "login_email_label", authService.getLastLoggedinEmail()))
    const [password, setPassword] = useState(defultInputState("password", "login_password_label", ""))
    const [submit, setSubmit] = useState(defultButtonState("login_submit"))
    
    useEffect(() => {
        if (loggedinUser) {
            navigate(`/home`)
        }

        setEmail({ ...email, value: authService.getLastLoggedinEmail() })  
    }, [])

    useEffect(() => {
        setSubmit({ 
            ...submit, 
            isDisabled: !utilService.REG_EXP.EMAIL.test(email.value) || !utilService.REG_EXP.PASSWORD.test(password.value)
        })
    }, [email, password])

    useEffect(() => {
        if (splash?.phrases) {
            setEmail({ ...email, label: utilService.getPhrase("login_email_label", splash?.phrases)})
            setPassword({ ...password, label: utilService.getPhrase("login_password_label", splash?.phrases)})
            setSubmit({ ...submit, text: utilService.getPhrase("login_submit", splash?.phrases)})
        }

        if (!splash?.phrases) {
            onLoadingStart()  
        } else {
            onLoadingDone()  
        }
    }, [splash?.phrases])

    function handleValueChanged(fieldName, value) {
        switch (fieldName) {
            case "email":
                setEmail({ ...email, value })
                break
            case "password":
                setPassword({ ...password, value })
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
            navigate(`/home`)

        } catch (error) {
            setError(utilService.getPhrase("login_credentials_error", splash?.phrases))
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
    
    const formClass = `login ${isLoadingState?'loading': ''}`

    return (
        <form className={formClass}>
            <article>
                <h2>{utilService.getPhrase('login_header', splash?.phrases)}</h2>
                <FormField type={"EMAIL"} key={keys.email} params={email} onChange={(value) => handleValueChanged('email', value)} />
                <FormField type={"PASSWORD"} key={keys.password} params={password} onChange={(value) => handleValueChanged('password', value)} />
                <div className='error'>{error}</div>
                <FormField type={"BUTTON_SUBMIT"} key={keys.submit} params={submit} onPress={handleSubmit} />
            </article>
            <article>
                <div><NavLink to='/signup' dangerouslySetInnerHTML={{ __html: utilService.getPhrase("login_goto_signup", splash?.phrases) }}></NavLink></div>
            </article>
            <article>
                <div><NavLink to='/forgot-password' dangerouslySetInnerHTML={{ __html: utilService.getPhrase("forgot_password_header", splash?.phrases) }}></NavLink></div>
            </article>
        </form>
    )
}
