import { httpService } from './http.service'
import { userService } from './user.service.js'
import { Preferences } from '@capacitor/preferences'
import { Capacitor } from '@capacitor/core'
import jwt_decode from "jwt-decode"

export const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
export const STORAGE_KEY_LAST_LOGGEDIN_EMAIL = "email"

const BASE_URL = 'auth/'

export const authService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    getLoggedinUserCompleted,
    getLastLoggedinEmail
}

async function login_USING_COOKIE(email, password) {
    const credentials = { email, password }

    const user = await httpService.post(BASE_URL + 'login', credentials)
    if (user) {
        delete user._id
        userService.saveLocalUser(user)
    }
    return user
    
}

async function login(email, password) {
    const credentials = { email, password }
    const token = await httpService.post(BASE_URL + 'login', credentials)

    if (token) {
        userService.saveLocalUser(token)
    }

    const user = jwt_decode(token)
    return user
    
}

async function signup_USING_COOKIE(credentials) {
    const user = await httpService.post(BASE_URL + 'signup', credentials)
    if (user) {
        userService.saveLocalUser(user)
    }
    return user
}

async function signup(credentials) {
    const token = await httpService.post(BASE_URL + 'signup', credentials)
    if (token) {
        userService.saveLocalUser(token)
    }
    const user = jwt_decode(token)
    return user
}

async function logout() {
    await Preferences.remove({ key: 'token' })
    //sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    await httpService.post(BASE_URL + 'logout')
}

function getLoggedinUser_USING_COOKIE() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getLoggedinUser() {
    let token

    if (Capacitor.isNativePlatform()) {
        //const { value: token } = await Preferences.get({ key: 'token' })
        Preferences.get({ key: 'token' })
            .then(({ value }) => {
                token = value
            })
            .catch((err) => {})
    } else {
        token = localStorage.getItem("token")
    }

    if (!token) {
        return null
    }

    const user = jwt_decode(token)
    return user
        
}

function getLoggedinUserCompleted() {
    const loggedinUser = getLoggedinUser()
    return (
        loggedinUser && 
        loggedinUser.fullname && 
        loggedinUser.email && 
        loggedinUser.yearOfBirth && 
        typeof loggedinUser.equity === 'number' && loggedinUser.equity >= 0 && 
        typeof loggedinUser.incomes === 'number' && loggedinUser.incomes >= 0  && 
        typeof loggedinUser.commitments === 'number' && loggedinUser.commitments >= 0  && 
        !!loggedinUser.termsOfUseAccept) 
}

function getLastLoggedinEmail() {
    return localStorage.getItem(STORAGE_KEY_LAST_LOGGEDIN_EMAIL)
}