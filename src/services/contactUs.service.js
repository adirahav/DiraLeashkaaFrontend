import { STORAGE_KEY_LAST_LOGGEDIN_EMAIL, STORAGE_KEY_LOGGEDIN_USER } from "./auth.service"
import { httpService } from "./http.service"

const BASE_URL = 'contactUs/'

export const contactUsService = {
    send
}

async function send(messageToSend) {
    messageToSend = {
        ...messageToSend,
        appEnv: process.env.NODE_ENV
    }
    const sentMessage = await httpService.post(BASE_URL, messageToSend)
    return sentMessage
}

