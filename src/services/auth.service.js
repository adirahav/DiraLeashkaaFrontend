import { httpService } from './http.service'
import { userService } from './user.service.js'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

const BASE_URL = 'auth/'

export const authService = {
    login,
    signup,
    logout
}

async function login(credentials) {
    credentials.password = "123456"
    const user = await httpService.post(BASE_URL + 'login', credentials)
    //console.log('user', user);
    if (user) {
        return userService.saveLocalUser(user)
    }
}

async function signup(credentials) {
    const user = await httpService.post(BASE_URL + 'signup', credentials)
    if (user) {
        return userService.saveLocalUser(user)
    }
}

async function logout() {
    await httpService.post(BASE_URL + 'logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

