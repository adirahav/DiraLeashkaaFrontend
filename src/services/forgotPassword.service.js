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
    
    return result
}


async function changePassword(newPassword) {
    const params = { newPassword }
    await httpService.put(BASE_URL + 'changePassword', params)
}