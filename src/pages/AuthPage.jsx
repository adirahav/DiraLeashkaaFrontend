import { useState, useEffect } from 'react'
import { userService } from '../services/user.service.js'
import { useSelector } from 'react-redux'
import { signup, login, logout, loadUsers } from '../store/actions/user.actions'
import { Footer } from "../cmps/Footer";
import { Header } from "../cmps/Header";
import { showErrorAlert, showSuccessAlert } from '../cmps/Alert.jsx';
import { ImageUpload } from '../cmps/ImageUpload.jsx';


export function AuthPage() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const [isSignup, setIsSignup] = useState(false)
    const users = useSelector(storeState => storeState.userModule.users)    // HELPER - TO DELETE
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    
    useEffect(() => {
        loadUsers()     // HELPER - TO DELETE
    }, [])

    function clearState() {
        setCredentials(userService.getEmptyUser())
        setIsSignup(false)
    }

    // signup / login
    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials(prevCredentials => ({ ...prevCredentials, [field]: value }))
    }

    async function onSubmitForm(ev = null) {
        if (ev) ev.preventDefault()
        
        if (isSignup) {
            if (!credentials.username || !credentials.password || !credentials.fullname) return

            try {
                await signup(credentials)
            } catch (err) {
                console.log('Cannot signup :', err)
                showErrorAlert({
                    message: 'Cannot signup',
                    closeButton: { show: true, autoClose: false }, 
                    positiveButton: { show: true, text: "OK", onPress: null, closeAfterPress: true }, 
                    negativeButton: { show: false }, 
                })
            }
        } else {
            if (!credentials.username) return

            try {
                await login(credentials)             
            } catch (err) {
                console.log('Cannot login :', err)
                showErrorAlert({
                    message: 'Cannot login',
                    closeButton: { show: true, autoClose: false }, 
                    positiveButton: { show: true, text: "OK", onPress: null, closeAfterPress: true }, 
                    negativeButton: { show: false }, 
                })
            }
        }
        clearState()
    }
    
    function onUploaded(imgUrl) {
        setCredentials(prevCredentials => ({ ...prevCredentials, imgUrl }))
    }
    
    // logout
    async function onLogout() {
        await logout()
    }    

    function toggleSignup() {
        setIsSignup(prevIsSignup => !prevIsSignup)
    }

    return (<>
        <Header />
        <main className="auth container">
            {!loggedinUser && <button className="btn-link" onClick={toggleSignup}>{!isSignup ? 'Not a user? Signup' : 'Already a user? Login'}</button>}
            {!loggedinUser && !isSignup && <section className="login">
                <form onSubmit={onSubmitForm}>
                    <select name="username" value={credentials.username} onChange={handleChange}>
                        <option value="">Select User</option>
                        {
                            users && users.length > 0 && users.map(user => <option key={user._id} value={user.username}>{user.fullname}</option>)
                        }
                    </select>
                    <input type="text" value={credentials.username} name="username" placeholder="Username" onChange={handleChange} required autoFocus />
                    <input type="password" value={credentials.password} name="password" placeholder="Password" onChange={handleChange} required />
                    <button>Login!</button>
                </form>
            </section>}
            {!loggedinUser && isSignup && <section className="signup">
                <form className="signup-form" onSubmit={onSubmitForm}>
                    <input type="text" name="fullname" value={credentials.fullname} placeholder="Fullname" onChange={handleChange} required />
                    <input type="text" name="username" value={credentials.username} placeholder="Username" onChange={handleChange} required />
                    <input type="password" name="password" value={credentials.password} placeholder="Password" onChange={handleChange} required />
                    <ImageUpload onUploaded={onUploaded} />
                    <button>Signup!</button>
                </form>
            </section>}
            {loggedinUser && <section className='logout'>
                <div>
                    <h3>Hello {loggedinUser.fullname}</h3>
                    <button onClick={onLogout}>Logout</button>
                </div>
            </section>}
            
        </main>
        <Footer />
    </>)
}
