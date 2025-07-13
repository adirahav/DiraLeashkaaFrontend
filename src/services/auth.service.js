import { httpService } from './http.service'
import { userService } from './user.service.js'

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

async function login(email, password) {
    const credentials = { email, password }

    const user = await httpService.post(BASE_URL + 'login', credentials)
    if (user) {
        delete user._id
        userService.saveLocalUser(user)
    }
    return user
    
}

async function signup(credentials) {
    const user = await httpService.post(BASE_URL + 'signup', credentials)
    if (user) {
        userService.saveLocalUser(user)
    }
    return user
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    await httpService.post(BASE_URL + 'logout')
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
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