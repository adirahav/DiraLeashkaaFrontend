import { STORAGE_KEY_LAST_LOGGEDIN_EMAIL } from './auth.service.js'
import { httpService } from './http.service.js'
import { userService } from './user.service.js'

const BASE_URL = 'forgotPassword/'

export const forgotPasswordService = {
    generateCode,
    validateCode,
    changePassword,
}

async function generateCode(email) {
    const params = { email }
    const result = await httpService.post(BASE_URL + 'generateCode', params)
    return result.token  
}

async function validateCode(email, code) {
    const params = { code }
    
    const result = await httpService.post(BASE_URL + 'validateCode', params)
    
    if (result && result.verified) {
        localStorage.setItem(STORAGE_KEY_LAST_LOGGEDIN_EMAIL, email)
    }
    return result
}


async function changePassword(newPassword) {
    const params = { newPassword }
    
    const user = await httpService.put(BASE_URL + 'changePassword', params)
    if (user) {
        userService.saveLocalUser(user)
    }
    return user
}